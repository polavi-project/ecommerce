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

    public function addMeta(array $attributes, $sortOrder = 0)
    {
        $this->metas[$sortOrder][] = $attributes;

        return $this;
    }

    public function getMetas()
    {
        $metas = [];
        ksort($this->metas);
        foreach ($this->metas as $meta) {
            foreach ($meta as $m)
                $metas[] = $m;
        }
        return $metas;
    }

    public function addLink(array $attributes, $sortOrder = 0)
    {
        $this->links[$sortOrder][] = $attributes;

        return $this;
    }

    public function getLinks()
    {
        $links = [];
        ksort($this->links);
        foreach ($this->links as $link) {
            foreach ($link as $l)
                $links[] = $l;
        }
        return $links;
    }

    public function addScript(array $attributes, $sortOrder = 0)
    {
        $this->scripts[$sortOrder][] = $attributes;

        return $this;
    }

    public function getScripts()
    {
        $scripts = [];
        ksort($this->scripts);
        foreach ($this->scripts as $script) {
            foreach ($script as $s)
                $scripts[] = $s;
        }
        return $scripts;
    }

    public function render()
    {
        ob_start();
        echo "<title data-react-helmet=\"true\">{$this->title}</title>";
        $metas = $this->getMetas();
        foreach ($metas as $meta) {
            $m = "<meta ";
            foreach ($meta as $key=>$value)
                $m .= "{$key}=\"{$value}\" ";
            $m .= "/>";
            echo $m;
        }
        $links = $this->getLinks();
        foreach ($links as $link) {
            $l = "<link ";
            foreach ($link as $key=>$value)
                $l .= "{$key}=\"{$value}\" ";
            $l .= "/>";
            echo $l;
        }
        $scripts = $this->getScripts();
        foreach ($scripts as $script) {
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
        return [
            'scripts'=> $this->getScripts(),
            'metas'=> $this->getMetas(),
            'links'=> $this->getLinks(),
            'title'=> $this->getTitle()
        ];
    }

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