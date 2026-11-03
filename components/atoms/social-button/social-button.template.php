<?php
// PHP twin of social-button.template.js: a 44 px round link with a network glyph, and a row of them.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';

defined('DS_SOCIAL_LINE') || define('DS_SOCIAL_LINE', 'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"');

// The site's glyphs, drawn centred on a 44 px square (about 18 px of glyph).
defined('DS_SOCIAL_ICONS') || define('DS_SOCIAL_ICONS', [
    'linkedin' => '<g transform="translate(12.45 12.8875)"><path d="M13.05 6.05C14.4424 6.05 15.7777 6.60312 16.7623 7.58769C17.7469 8.57226 18.3 9.90761 18.3 11.3V17.425H14.8V11.3C14.8 10.8359 14.6156 10.3908 14.2874 10.0626C13.9592 9.73438 13.5141 9.55 13.05 9.55C12.5859 9.55 12.1408 9.73438 11.8126 10.0626C11.4844 10.3908 11.3 10.8359 11.3 11.3V17.425H7.8V11.3C7.8 9.90761 8.35312 8.57226 9.33769 7.58769C10.3223 6.60312 11.6576 6.05 13.05 6.05Z" ' . DS_SOCIAL_LINE . '/><path d="M4.3 6.925H0.8V17.425H4.3V6.925Z" ' . DS_SOCIAL_LINE . '/><path d="M2.55 4.3C3.5165 4.3 4.3 3.5165 4.3 2.55C4.3 1.5835 3.5165 0.8 2.55 0.8C1.5835 0.8 0.8 1.5835 0.8 2.55C0.8 3.5165 1.5835 4.3 2.55 4.3Z" ' . DS_SOCIAL_LINE . '/></g>',
    'facebook' => '<path d="M25.4102 23.125L25.8769 19.8674H22.9589V17.7535C22.9589 16.8623 23.3665 15.9936 24.6734 15.9936H26V13.2201C26 13.2201 24.7961 13 23.6451 13C21.242 13 19.6712 14.5602 19.6712 17.3847V19.8674H17V23.125H19.6712V31H22.9589V23.125H25.4102Z" fill="currentColor"/>',
    'instagram' => '<path d="M22.002 17.385C19.4481 17.385 17.3881 19.4455 17.3881 22C17.3881 24.5545 19.4481 26.615 22.002 26.615C24.5559 26.615 26.616 24.5545 26.616 22C26.616 19.4455 24.5559 17.385 22.002 17.385ZM22.002 25.0003C20.3516 25.0003 19.0023 23.6548 19.0023 22C19.0023 20.3452 20.3476 18.9997 22.002 18.9997C23.6564 18.9997 25.0017 20.3452 25.0017 22C25.0017 23.6548 23.6524 25.0003 22.002 25.0003ZM27.8809 17.1963C27.8809 17.7947 27.399 18.2727 26.8047 18.2727C26.2064 18.2727 25.7285 17.7907 25.7285 17.1963C25.7285 16.6018 26.2104 16.1198 26.8047 16.1198C27.399 16.1198 27.8809 16.6018 27.8809 17.1963ZM30.9368 18.2887C30.8685 16.8468 30.5392 15.5696 29.4831 14.5172C28.431 13.4649 27.154 13.1356 25.7124 13.0633C24.2267 12.9789 19.7733 12.9789 18.2876 13.0633C16.85 13.1315 15.573 13.4609 14.5169 14.5132C13.4608 15.5655 13.1355 16.8428 13.0632 18.2847C12.9789 19.7708 12.9789 24.2251 13.0632 25.7113C13.1315 27.1532 13.4608 28.4304 14.5169 29.4828C15.573 30.5351 16.846 30.8644 18.2876 30.9367C19.7733 31.0211 24.2267 31.0211 25.7124 30.9367C27.154 30.8685 28.431 30.5391 29.4831 29.4828C30.5352 28.4304 30.8645 27.1532 30.9368 25.7113C31.0211 24.2251 31.0211 19.7749 30.9368 18.2887ZM29.0173 27.3058C28.7041 28.093 28.0977 28.6995 27.3066 29.0168C26.122 29.4868 23.3111 29.3783 22.002 29.3783C20.6929 29.3783 17.878 29.4828 16.6974 29.0168C15.9103 28.7036 15.304 28.0971 14.9867 27.3058C14.5169 26.1209 14.6253 23.3094 14.6253 22C14.6253 20.6906 14.5209 17.875 14.9867 16.6942C15.2999 15.907 15.9063 15.3005 16.6974 14.9832C17.882 14.5132 20.6929 14.6217 22.002 14.6217C23.3111 14.6217 26.126 14.5172 27.3066 14.9832C28.0937 15.2964 28.7001 15.9029 29.0173 16.6942C29.4871 17.8791 29.3787 20.6906 29.3787 22C29.3787 23.3094 29.4871 26.125 29.0173 27.3058Z" fill="currentColor"/>',
    'youtube' => '<path d="M30.6243 17.8781C30.4167 17.1375 29.807 16.5563 29.0326 16.3594C27.6287 16 22 16 22 16C22 16 16.3713 16 14.9674 16.3594C14.193 16.5563 13.5833 17.1375 13.3757 17.8781C13 19.2188 13 22.0125 13 22.0125C13 22.0125 13 24.8063 13.3757 26.1469C13.5833 26.8875 14.193 27.4437 14.9674 27.6406C16.3713 28 22 28 22 28C22 28 27.6287 28 29.0326 27.6406C29.807 27.4437 30.4167 26.8844 30.6243 26.1469C31 24.8063 31 22.0125 31 22.0125C31 22.0125 31 19.2188 30.6243 17.8781ZM20.1611 24.55V19.475L24.8638 22.0125L20.1611 24.55Z" fill="currentColor"/>',
    'spotify' => '<path d="M13 28.5c6-4 12-4 18 0" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M14.5 24.5c5-3.2 10-3.2 15 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M16 20.7c3.8-2.3 8.2-2.3 12 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
]);

defined('DS_SOCIAL_NETWORKS') || define('DS_SOCIAL_NETWORKS', ['linkedin' => 'LinkedIn', 'facebook' => 'Facebook', 'instagram' => 'Instagram', 'youtube' => 'YouTube', 'spotify' => 'Spotify']);
defined('DS_SOCIAL_VARIANTS') || define('DS_SOCIAL_VARIANTS', ['plain', 'raised']);

if (!function_exists('ds_render_social_button')) {
    function ds_render_social_button(array $args = []): string
    {
        ['network' => $network, 'href' => $href, 'ariaLabel' => $ariaLabel, 'variant' => $variant] = $args + [
            'network' => 'linkedin', 'href' => '#', 'ariaLabel' => '', 'variant' => 'plain',
        ];
        $networkName = is_string($network) && isset(DS_SOCIAL_ICONS[$network]) ? $network : 'linkedin';
        $classes = ds_class_list(['ds-social-button', $variant === 'raised' ? 'ds-social-button--raised' : '']);
        $name = ds_escape_html(ds_truthy($ariaLabel) ? $ariaLabel : DS_SOCIAL_NETWORKS[$networkName]);
        $icon = '<svg class="ds-social-button__icon" viewBox="0 0 44 44" fill="none" aria-hidden="true" focusable="false">' . DS_SOCIAL_ICONS[$networkName] . '</svg>';
        return '<a class="' . $classes . '" href="' . ds_escape_html($href) . '" target="_blank" rel="noopener" aria-label="' . $name . '">' . $icon . '</a>';
    }
}

if (!function_exists('ds_render_social_list')) {
    // A row of social buttons. items: [{ network, href, ariaLabel? }].
    function ds_render_social_list(array $args = []): string
    {
        $defaultItems = array_map(static fn (string $network): array => ['network' => $network, 'href' => '#'], array_keys(DS_SOCIAL_NETWORKS));
        ['items' => $items, 'variant' => $variant] = $args + ['items' => $defaultItems, 'variant' => 'plain'];
        $list = '';
        foreach ($items as $item) {
            $list .= '<li>' . ds_render_social_button(array_merge($item, ['variant' => $variant])) . '</li>';
        }
        return '<ul class="ds-social-list" role="list">' . $list . '</ul>';
    }
}
