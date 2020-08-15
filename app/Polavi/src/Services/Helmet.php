<?php
/**
 * Copyright © Nguyen Huu The <the.nguyen@polavi.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Polavi\Services;


class Helmet
{
    public $title;

    public $metas = [];

    public $links = [];

    public $scripts = [];

    protected $htmlBeforeCloseHead = [];

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     * @return $this
     */
    public function setTitle($title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @param array $attributes
     * @param int $sortOrder
     * @return $this
     */
    public function addMeta(array $attributes, $sortOrder = 0)
    {
        $this->metas[$sortOrder][] = $attributes;

        return $this;
    }

    /**
     * @return array
     */
    public function getMetas()
    {
        $metas = [];
        ksort($this->metas);
        foreach ($this->metas as $meta) {
            foreach ($meta as $m) {
                $metas[] = $m;
            }
        }
        return $metas;
    }

    /**
     * @param array $attributes
     * @param int $sortOrder
     * @return $this
     */
    public function addLink(array $attributes, $sortOrder = 0)
    {
        $this->links[$sortOrder][] = $attributes;

        return $this;
    }

    /**
     * @return array
     */
    public function getLinks()
    {
        $links = [];
        ksort($this->links);
        foreach ($this->links as $link) {
            foreach ($link as $l) {
                $links[] = $l;
            }
        }
        return $links;
    }

    /**
     * @param array $attributes
     * @param int $sortOrder
     * @return $this
     */
    public function addScript(array $attributes, $sortOrder = 0)
    {
        $this->scripts[$sortOrder][] = $attributes;

        return $this;
    }

    /**
     * @return array
     */
    public function getScripts()
    {
        $scripts = [];
        ksort($this->scripts);
        foreach ($this->scripts as $script) {
            foreach ($script as $s) {
                $scripts[] = $s;
            }
        }
        return $scripts;
    }

    /**
     * @return false|string
     */
    public function render()
    {
        ob_start();
        echo "<title data-react-helmet=\"true\">{$this->title}</title>";
        $metas = $this->getMetas();
        foreach ($metas as $meta) {
            $m = "<meta ";
            foreach ($meta as $key => $value) {
                $m .= "{$key}=\"{$value}\" ";
            }
            $m .= "/>";
            echo $m;
        }
        $links = $this->getLinks();
        foreach ($links as $link) {
            $l = "<link ";
            foreach ($link as $key => $value) {
                $l .= "{$key}=\"{$value}\" ";
            }
            $l .= "/>";
            echo $l;
        }
        $scripts = $this->getScripts();
        foreach ($scripts as $script) {
            $s = "<script ";
            foreach ($script as $key => $value) {
                $s .= "{$key}=\"{$value}\" ";
            }
            $s .= "></script>";
            echo $s;
        }
        $output = ob_get_clean();

        return $output;
    }

    /**
     * @return array
     */
    public function getData()
    {
        return [
            'scripts'=> $this->getScripts(),
            'metas'=> $this->getMetas(),
            'links'=> $this->getLinks(),
            'title'=> $this->getTitle()
        ];
    }

    /**
     * @param string $html
     * @return $this
     */
    public function addHtmlBeforeCloseHead(string $html)
    {
        $this->htmlBeforeCloseHead[] = $html;

        return $this;
    }

    /**
     * @return array
     */
    public function getHtmlBeforeCloseHead(): array
    {
        return $this->htmlBeforeCloseHead;
    }
}