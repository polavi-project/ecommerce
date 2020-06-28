<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@similik.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Module\Catalog\Middleware\Product\Save;

use Monolog\Logger;
use function Similik\create_mutable_var;
use Similik\Module\Catalog\Services\ProductMutator;
use Similik\Services\Db\Processor;
use Similik\Services\Http\Request;
use Similik\Services\Http\Response;
use Similik\Middleware\MiddlewareAbstract;

class SaveVariantMiddleware extends MiddlewareAbstract
{
    /**
     * @param Request $request
     * @param Response $response
     * @param null $delegate
     * @return mixed
     */
    public function __invoke(Request $request, Response $response, $delegate = null)
    {
        $productId = $this->getDelegate(CreateMiddleware::class, $this->getDelegate(UpdateMiddleware::class, null));
        $variantG = $request->request->get('variant_group', null);
        if(
            $variantG == null
            || $productId == null
            || !isset($variantG["variants"])
            || !$variantG["variants"]
        ) {
            return $delegate;
        }

        try {
            $conn = new Processor();
            $conn->startTransaction();

            $product = $conn->getTable("product")->load($productId);
            // Remove product from Variant group if attribute group was changed
            if(
                $product["variant_group_id"] &&
                !$conn->getTable("variant_group")
                    ->where("variant_group_id", "=", $product["variant_group_id"])
                    ->andWhere("attribute_group_id", "=", $product["group_id"])
                    ->fetchOneAssoc()
            ) {
                $conn->getTable("product")->where("product_id", "=", $product["product_id"])->update(["variant_group_id" => null]);
                $conn->commit();

                return $delegate;
            }

            // Variant saving
            $variantGroup = $request->request->get("variant_group", []);
            if(isset($variantGroup["variant_group_id"]) && $variantGroup["variant_group_id"])
                if($product["variant_group_id"] != $variantGroup["variant_group_id"])
                    return $delegate;

            $groupAttributes = $variantGroup['variant_group_attributes'];
            if(count($groupAttributes) > 5)
                throw new \Exception("We support maximum 5 attributes for variant group");

            $attrs = $conn->getTable("attribute")
                ->leftJoin("attribute_group_link")
                ->where("attribute.attribute_id", "IN", $groupAttributes)
                ->andWhere("type", "=", "select")
                ->andWhere("attribute_group_link.group_id", "=", $product["group_id"])
                ->fetchAllAssoc();
            if(count($attrs) != count($groupAttributes))
                throw new \Exception("Variant attribute is either not existed or not a dropdown type");

            $variantGroupData = [
                "attribute_group_id" => $product["group_id"]
            ];

            foreach ($groupAttributes as $key => $val) {
                switch ($key) {
                    case 0:
                        $variantGroupData['attribute_one'] = $val;
                        break;
                    case 1:
                        $variantGroupData['attribute_two'] = $val;
                        break;
                    case 2:
                        $variantGroupData['attribute_three'] = $val;
                        break;
                    case 3:
                        $variantGroupData['attribute_four'] = $val;
                        break;
                    case 4:
                        $variantGroupData['attribute_five'] = $val;
                        break;
                }
            }
            $variantGroupData = array_merge([
                "attribute_one" => null,
                "attribute_two" => null,
                "attribute_three" => null,
                "attribute_four" => null,
                "attribute_five" => null,
            ], $variantGroupData);

            if(isset($variantGroup["variant_group_id"]) && $variantGroup["variant_group_id"]) {
                $group = $conn->getTable("variant_group")->load($variantGroup["variant_group_id"]);
                if(!$group)
                    throw new \Exception("Requested group does not exist");
                $conn->getTable("variant_group")->where("variant_group_id", "=", $variantGroup["variant_group_id"])->update($variantGroupData);
                $groupId = $variantGroup["variant_group_id"];
            } else {
                $conn->getTable("variant_group")->insert($variantGroupData);
                $groupId = $conn->getLastID();
            }

            $variants = $variantGroup['variants'];
            $productData = $request->request->all();
            unset($productData["images"]);

            foreach ($variants as $variant) {
                if($variant['sku'] == $product['sku']) {
                    $conn->getTable("product")->where("product_id", "=", $productId)->update([
                        'variant_group_id' => $groupId,
                        'visibility' => $variant['visibility'] ?? 0
                    ]);
                    continue;
                }

                $p = $conn->getTable('product')->where('sku', '=', $variant['sku'])->fetchOneAssoc();
                if(!$p) {
                    $productData['variant_group_id'] = $groupId;
                    $productData['visibility'] = $variant['visibility'] ?? 0;
                    $productData['sku'] = $variant['sku'];
                    $productData['main_image'] = $variant['image'] ?? null;
                    $productData['status'] = $variant['status'];
                    $productData['price'] = $variant['price'];
                    $productData['qty'] = $variant['qty'];
                    $productData['seo_key'] = $productData['seo_key'] . "-" . str_replace(" ", "-", $variant['sku']);
                    $productData = create_mutable_var("variant_data_before_create", $productData, [$product, $variantGroup]);
                    $productMutator = new ProductMutator($conn);
                    $pId = $productMutator->createProduct($productData);
                } else {
                    $pId = $p["product_id"];
                    if($p["group_id"] != $product["group_id"])
                        throw new \Exception("{$p["sku"]} is not valid variant");

                    $updateData = create_mutable_var("variant_data_before_update", [
                        "variant_group_id" => $groupId,
                        "visibility" => $variant['visibility'] ?? 0,
                        "main_image" => $variant['image'] ?? null,
                        "status" => $variant['status'],
                        "price" => $variant['price'],
                        "qty" => $variant['qty'],
                    ], [$product, $variantGroup]);
                    $conn->getTable("product")->where("sku", "=", $variant["sku"])->update($updateData);
                }
                foreach ($variant['attributes'] as $id=>$value) {
                    $attributeOption = $conn->getTable('attribute_option')->load($value);
                    $conn->getTable("product_attribute_value_index")->insertOnUpdate([
                        "product_id" => $pId,
                        "attribute_id" => $id,
                        "option_id" => (int) $value,
                        "attribute_value_text" => $attributeOption["option_text"]
                    ]);
                }
            }
            $conn->commit();
        } catch(\Exception $e) {
            $conn->rollback();
            // Log an error message here and silently ignore the error
            $this->getContainer()->get(Logger::class)->addError($e->getMessage());
        }

        return $response;
    }
}