<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;

class SwitcherPlugin extends Plugin
{
    public static function getSubscribedEvents()
    {
        return [
            'onTwigSiteVariables' => ['onTwigSiteVariables', 0]
        ];
    }

    public function onTwigSiteVariables()
    {
        $config = $this->grav['config'];

        // ユーザーエージェントでデバイスを判定
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        // シンプルな判定（スマホ用）
        $isMobile = preg_match('/(android|iphone|ipad|ipod|windows phone)/i', $userAgent);

        // スマホなら Quark、PCなら BigPicture
        $theme = $isMobile ? 'quark' : 'big-picture';

        // 設定を変更
        $config->set('system.pages.theme', $theme);
    }
}
