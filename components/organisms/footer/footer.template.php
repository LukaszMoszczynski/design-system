<?php
// PHP twin of footer.template.js: newsletter, brand column, office / contact / menu / services columns, legal line.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/form-field/form-field.template.php';
require_once __DIR__ . '/../../atoms/link/link.template.php';
require_once __DIR__ . '/../../molecules/social-row/social-row.template.php';

defined('DS_FOOTER_TAGS') || define('DS_FOOTER_TAGS', ['footer', 'div']);

if (!function_exists('ds_footer_links')) {
    // Texts → [{ text, href: '#' }].
    function ds_footer_links(array $texts): array
    {
        return array_map(static fn (string $text): array => ['text' => $text, 'href' => '#'], $texts);
    }
}

defined('DS_FOOTER_DEFAULTS') || define('DS_FOOTER_DEFAULTS', [
    'newsletter' => ['title' => 'Zapisz się na newsletter', 'lead' => 'Raz w miesiącu: praktyczna wiedza o przywództwie, komunikacji i zdrowych organizacjach. Bez spamu.', 'action' => '#'],
    'office' => ['title' => 'Biuro', 'lines' => ['DCC Grygorcewicz', 'ul. Przykładowa 12/3', '70-001 Szczecin']],
    'contact' => ['title' => 'Kontakt', 'phone' => '+48 600 000 000', 'email' => 'biuro@dcc.pl', 'social' => DS_SOCIAL_ROW_DEFAULT_ITEMS],
    'menu' => ['title' => 'Menu', 'items' => ds_footer_links(['Oferta', 'Szkolenia', 'Metody', 'O nas', 'Blog', 'Kontakt'])],
    'services' => ['title' => 'Usługi', 'items' => ds_footer_links(['Szkolenia dla liderów', 'Szkolenia dla zespołów sprzedaży', 'Coaching menedżerski', 'Badania 360 i Insights Discovery'])],
    'legal' => ds_footer_links(['Polityka prywatności', 'Regulamin', 'Cookies']),
]);

if (!function_exists('ds_footer_link_list')) {
    function ds_footer_link_list(array $items): string
    {
        $rows = '';
        foreach ($items as $item) {
            $rows .= '<li>' . ds_render_link(ds_pick($item, ['text', 'href']) + ['variant' => 'footer']) . '</li>';
        }
        return '<ul class="ds-footer__links" role="list">' . $rows . '</ul>';
    }
}

if (!function_exists('ds_footer_newsletter')) {
    function ds_footer_newsletter(mixed $newsletter): string
    {
        if (!ds_truthy($newsletter)) {
            return '';
        }
        $lead = ds_truthy($newsletter['lead'] ?? null) ? '<p class="ds-footer__newsletter-lead">' . ds_escape_html($newsletter['lead']) . '</p>' : '';
        return '<div class="ds-footer__newsletter"><h2 class="ds-footer__newsletter-title">' . ds_escape_html($newsletter['title'] ?? null) . '</h2>' . $lead . '<form class="ds-footer__form" action="' . ds_escape_html($newsletter['action'] ?? '#') . '" method="post">' . ds_render_newsletter_field() . '</form></div>';
    }
}

if (!function_exists('ds_footer_brand')) {
    function ds_footer_brand(mixed $logo, mixed $logoAlt, mixed $homeHref, mixed $homeAriaLabel, array $badges, mixed $hashtag, mixed $hashtagHref, mixed $about): string
    {
        $logoMark = ds_truthy($logo)
            ? '<img class="ds-footer__logo-image" src="' . ds_escape_html($logo) . '" alt="' . ds_escape_html($logoAlt) . '">'
            : '<span class="ds-footer__logo-placeholder" aria-hidden="true"></span>';
        $badgeMarks = '';
        foreach ($badges as $badge) {
            $badgeMarks .= ds_truthy($badge['src'] ?? null)
                ? '<img class="ds-footer__badge" src="' . ds_escape_html($badge['src']) . '" alt="' . ds_escape_html($badge['alt'] ?? '') . '">'
                : '<span class="ds-footer__badge ds-footer__badge--placeholder" aria-hidden="true"></span>';
        }
        return '<div class="ds-footer__brand">'
            . '<a class="ds-footer__logo" href="' . ds_escape_html($homeHref) . '" aria-label="' . ds_escape_html($homeAriaLabel) . '">' . $logoMark . '</a>'
            . (count($badges) > 0 ? '<div class="ds-footer__badges">' . $badgeMarks . '</div>' : '')
            . (ds_truthy($hashtag) ? '<p class="ds-footer__tag"><a class="ds-footer__tag-link" href="' . ds_escape_html($hashtagHref) . '">' . ds_escape_html($hashtag) . '</a></p>' : '')
            . (ds_truthy($about) ? '<p class="ds-footer__about">' . ds_escape_html($about) . '</p>' : '')
            . '</div>';
    }
}

if (!function_exists('ds_render_footer')) {
    function ds_render_footer(array $args = []): string
    {
        [
            'newsletter' => $newsletter, 'logo' => $logo, 'logoAlt' => $logoAlt, 'homeHref' => $homeHref, 'homeAriaLabel' => $homeAriaLabel,
            'badges' => $badges, 'hashtag' => $hashtag, 'hashtagHref' => $hashtagHref, 'about' => $about, 'office' => $office,
            'contact' => $contact, 'menu' => $menu, 'menuAriaLabel' => $menuAriaLabel, 'services' => $services,
            'copyright' => $copyright, 'legal' => $legal, 'tag' => $tag,
        ] = $args + [
            'newsletter' => DS_FOOTER_DEFAULTS['newsletter'],
            'logo' => '',
            'logoAlt' => '',
            'homeHref' => '/',
            'homeAriaLabel' => 'DCC Grygorcewicz — strona główna',
            'badges' => [[], []],
            'hashtag' => '#zdroweorganizacje',
            'hashtagHref' => '#',
            'about' => 'DCC Grygorcewicz: szkolenia, coaching i doradztwo dla liderów i zespołów. Od 2008 roku pomagamy firmom budować zdrowe organizacje.',
            'office' => DS_FOOTER_DEFAULTS['office'],
            'contact' => DS_FOOTER_DEFAULTS['contact'],
            'menu' => DS_FOOTER_DEFAULTS['menu'],
            'menuAriaLabel' => 'Menu w stopce',
            'services' => DS_FOOTER_DEFAULTS['services'],
            'copyright' => '© 2026 DCC Grygorcewicz. Wszystkie prawa zastrzeżone.',
            'legal' => DS_FOOTER_DEFAULTS['legal'],
            'tag' => 'footer',
        ];
        $tagName = in_array($tag, DS_FOOTER_TAGS, true) ? $tag : 'footer';
        $title = static fn (mixed $text): string => '<h2 class="ds-footer__title">' . ds_escape_html($text) . '</h2>';
        $officeLines = implode('', array_map(static fn (mixed $line): string => '<span>' . ds_escape_html($line) . '</span>', array_values($office['lines'])));
        $officeColumn = '<div class="ds-footer__column ds-footer__column--office">' . $title($office['title'] ?? null) . '<address class="ds-footer__lines">' . $officeLines . '</address></div>';
        $phone = $contact['phone'] ?? null;
        $email = $contact['email'] ?? null;
        $contactLines = (ds_truthy($phone) ? '<a class="ds-footer__line-link" href="' . ds_escape_html('tel:' . preg_replace('/[^\d+]/', '', ds_string($phone))) . '">' . ds_escape_html($phone) . '</a>' : '')
            . (ds_truthy($email) ? '<a class="ds-footer__line-link" href="mailto:' . ds_escape_html($email) . '">' . ds_escape_html($email) . '</a>' : '');
        $social = $contact['social'] ?? null;
        $socialRow = is_array($social) && count($social) > 0 ? ds_render_social_row(['items' => $social, 'variant' => 'raised']) : '';
        $contactColumn = '<div class="ds-footer__column ds-footer__column--contact">' . $title($contact['title'] ?? null) . '<div class="ds-footer__lines">' . $contactLines . '</div>' . $socialRow . '</div>';
        $menuColumn = '<nav class="ds-footer__column ds-footer__column--menu" aria-label="' . ds_escape_html($menuAriaLabel) . '">' . $title($menu['title'] ?? null) . ds_footer_link_list($menu['items']) . '</nav>';
        $serviceItems = is_array($services) ? ($services['items'] ?? null) : null;
        $servicesColumn = is_array($serviceItems) && count($serviceItems) > 0
            ? '<div class="ds-footer__column ds-footer__column--services">' . $title($services['title'] ?? null) . ds_footer_link_list($serviceItems) . '</div>'
            : '';
        $columns = '<div class="ds-footer__columns"><div class="ds-footer__row">' . $officeColumn . $contactColumn . '</div><div class="ds-footer__row ds-footer__row--links">' . $menuColumn . $servicesColumn . '</div></div>';
        $legalLinks = '';
        if (count($legal) > 0) {
            $legalLinks = '<ul class="ds-footer__legal-links" role="list">';
            foreach ($legal as $item) {
                $legalLinks .= '<li><a class="ds-footer__legal-link" href="' . ds_escape_html($item['href'] ?? null) . '">' . ds_escape_html($item['text'] ?? null) . '</a></li>';
            }
            $legalLinks .= '</ul>';
        }
        $legalLine = '<div class="ds-footer__legal"><p class="ds-footer__copyright">' . ds_escape_html($copyright) . '</p>' . $legalLinks . '</div>';
        return '<' . $tagName . ' class="ds-footer"><div class="ds-footer__card">' . ds_footer_newsletter($newsletter) . '<div class="ds-footer__grid">'
            . ds_footer_brand($logo, $logoAlt, $homeHref, $homeAriaLabel, $badges, $hashtag, $hashtagHref, $about) . $columns . '</div>' . $legalLine . '</div></' . $tagName . '>';
    }
}
