<?php
/**
 * Copyright © Nguyen Huu The <thenguyen.dev@gmail.com>.
 * See COPYING.txt for license details.
 */

declare(strict_types=1);

namespace Similik\Services;


class Helmet
{
    public $title;

    public $metas = [];

    public $links = [];

    public $scripts = [];

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

    public function addMeta(array $attributes)
    {
        $this->metas[] = $attributes;

        return $this;
    }

    public function getMetas()
    {
        return $this->metas;
    }

    public function addLink(array $attributes)
    {
        $this->links[] = $attributes;

        return $this;
    }

    public function getLinks()
    {
        return $this->links;
    }

    public function addScript(array $attributes)
    {
        $this->scripts[] = $attributes;

        return $this;
    }

    public function getScripts()
    {
        return $this->scripts;
    }

    public function render()
    {
        ob_start();
        echo "<title data-react-helmet=\"true\">{$this->title}</title>";
        foreach ($this->metas as $meta) {
            $m = "<meta ";
            foreach ($meta as $key=>$value)
                $m .= "{$key}=\"{$value}\" ";
            $m .= "/>";
            echo $m;
        }
        foreach ($this->links as $link) {
            $l = "<link ";
            foreach ($link as $key=>$value)
                $l .= "{$key}=\"{$value}\" ";
            $l .= "/>";
            echo $l;
        }

        foreach ($this->scripts as $script) {
            $s = "<script ";
            foreach ($script as $key=>$value)
                $s .= "{$key}=\"{$value}\" ";
            $s .= "></script>";
            echo $s;
        }
        $output = ob_get_clean();

        return $output;
    }

    public function getData()
    {
        return (array) $this;
    }
}