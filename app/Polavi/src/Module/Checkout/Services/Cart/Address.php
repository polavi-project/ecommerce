<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Module\Checkout\Services\Cart;


use MJS\TopSort\Implementations\ArraySort;
use function Polavi\dispatch_event;

class Address
{
    protected $type;

    protected $isChanged = false;

    protected $fields;

    /**@var callable[]*/
    protected $resolvers = [];

    protected $dataSource = [];

    /**
     * @var array
     */
    protected $data;

    protected $error;

    public function __construct(array $data)
    {
        $this->initFields();
        $this->setData($data);
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    protected function initFields()
    {
        $this->fields = [
            'address_id' => [
                'resolver' => function($dataSource) {
                    return $this->getData('address_id') ?? $dataSource['address_id'] ?? null;
                }
            ],
            'address_type' => [
                'resolver' => function($dataSource) {
                    $type = $this->getData('address_type') ?? $dataSource['address_type'] ?? null;
                    if (!in_array($type, ['shipping', 'billing']))
                        $this->error = "Wrong address type";

                    return $type;
                }
            ],
            'country' => [
                'resolver' => function($dataSource) {
                    $country =  $dataSource['country'] ?? null;
                    if (!$country)
                        $this->error = "{$this->data['address_type']} country could not be empty";
                    return $country;
                }
            ],
            'province' => [
                'resolver' => function($dataSource) {
                    $province =  $dataSource['province'] ?? null;
//                    if (!$province)
//                        $this->error = "{$this->data['address_type']} province could not be empty";
                    return $province;
                },
                'dependencies' => ['country']
            ],
            'city' => [
                'resolver' => function($dataSource) {
                    return $dataSource['city'] ?? null;
                }
            ],
            'postcode' => [
                'resolver' => function($dataSource) {
                    $postcode =  $dataSource['postcode'] ?? null;
                    if (!$postcode)
                        $this->error = "{$this->data['address_type']} postcode could not be empty";
                    return $postcode;
                },
                'dependencies' => ['country']
            ],
            'address1' => [
                'resolver' => function($dataSource) {
                    $address1 =  $dataSource['address1'] ?? null;
                    if (!$address1)
                        $this->error = "{$this->data['address_type']} address1 could not be empty";
                    return $address1;
                }
            ],
            'address2' => [
                'resolver' => function($dataSource) {
                    return $dataSource['address2'] ?? null;
                }
            ],
            'telephone' => [
                'resolver' => function($dataSource) {
                    $telephone =  $dataSource['telephone'] ?? null;
                    if (!$telephone)
                        $this->error = "{$this->data['address_type']} telephone could not be empty";
                    return $telephone;
                }
            ],
            'full_name' => [
                'resolver' => function($dataSource) {
                    $fullName =  $dataSource['full_name'] ?? null;
                    if (!$fullName)
                        $this->error = "{$this->data['address_type']} name could not be empty";
                    return $fullName;
                }
            ],
            'prefix' => [
                'resolver' => function($dataSource) {
                    return $dataSource['prefix'] ?? null;
                }
            ]
        ];

        $sorter = new ArraySort();
        foreach ($this->fields as $key=>$value) {
            $sorter->add($key, $value['dependencies'] ?? []);
        }
        $sorted = $sorter->doSort();

        foreach ($sorted as $key=>$value)
            $this->resolvers[$value] = $this->fields[$value]['resolver'];
    }

    public function getData($key)
    {
        return $this->data[$key] ?? null;
    }

    public function setData(array $data)
    {
        $this->error = null;
        $this->dataSource = $data;
        $this->onChange();
        return $this;
    }

    protected function onChange()
    {
        foreach ($this->resolvers as $field=>$resolver) {
            $bound = \Closure::bind($resolver, $this);
            $this->data[$field] = $bound($this->dataSource);
        }
        $this->isChanged = true;
        dispatch_event($this->type . "_changed", [$this]);
    }

    public function toArray()
    {
        return $this->data;
    }
}