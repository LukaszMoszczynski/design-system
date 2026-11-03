<?php
// PHP twin of hero.template.js: the hero section (large, contact, three subpage tones) with tiles or breadcrumbs.
declare(strict_types=1);

require_once __DIR__ . '/../../_shared/escape.php';
require_once __DIR__ . '/../../atoms/breadcrumbs/breadcrumbs.template.php';
require_once __DIR__ . '/../../atoms/button/button.template.php';
require_once __DIR__ . '/../../atoms/text/text.template.php';
require_once __DIR__ . '/../../molecules/card-hero-tile/card-hero-tile.template.php';

defined('DS_HERO_VARIANTS') || define('DS_HERO_VARIANTS', ['large', 'contact', 'subpage-light', 'subpage-violet', 'subpage-orange']);
defined('DS_HERO_HEADING_TAGS') || define('DS_HERO_HEADING_TAGS', ['h1', 'h2']);

defined('DS_HERO_DEFAULT_TILES') || define('DS_HERO_DEFAULT_TILES', [
    [
        'title' => 'Oferta szkoleń wewnętrznych',
        'text' => 'Poznaj nasze programy dla liderów, zespołów, specjalistów i zarządów – znajdź rozwiązanie dla swojej organizacji.',
        'href' => '#',
    ],
    [
        'title' => 'Oferta szkoleń otwartych',
        'hashtag' => '#rozwijamySzczecin',
        'text' => 'Dołącz do najbliższego szkolenia – poznaj aktualne terminy i tematy najbliższych szkoleń.',
        'href' => '#',
    ],
    [
        'title' => 'BLOG',
        'hashtag' => '#zdroweorganizacje',
        'text' => 'Praktyczna wiedza o przywództwie, komunikacji i budowaniu Zdrowych Organizacji.',
        'href' => '#',
    ],
]);

defined('DS_HERO_SUBPAGE_COPY') || define('DS_HERO_SUBPAGE_COPY', [
    'title' => 'Rozwój liderów',
    'titleAccent' => '',
    'lead' => 'Programy dla liderów, menedżerów, brygadzistów, kierowników na każdym etapie rozwoju',
    'leadAccent' => '',
    'subtitle' => 'Od fundamentów przywództwa po zaawansowane strategie zarządzania',
    'button' => null,
]);

defined('DS_HERO_COPY') || define('DS_HERO_COPY', [
    'large' => [
        'title' => 'Jak poukładać relacje i kompetencje w firmie, by wspólnie osiągać wyniki?',
        'titleAccent' => 'poukładać relacje i kompetencje',
        'lead' => 'Odpowiedź jest prosta – a jednocześnie trudna. Pomagamy liderom, menedżerom i zespołom rozwijać się w organizacjach technologicznych, produkcyjnych i usługowych. Pokazujemy, jak budować Zdrowe Organizacje.',
        'leadAccent' => '',
        'subtitle' => 'Szkolenia, coaching i consulting dla firm',
        'button' => ['text' => 'Chcę poznać ofertę', 'href' => '#'],
    ],
    'contact' => [
        'title' => 'Zapraszamy do nas',
        'titleAccent' => '',
        'lead' => 'Nasze biuro w centrum Szczecina to kameralna przestrzeń do rozmów coachingowych 1:1 oraz grupowej pracy rozwojowej. Umów się na sesję przy kawie osobiście, hybrydowo albo wyłącznie online, jeśli tak jest Tobie wygodniej.',
        'leadAccent' => 'Umów się na sesję przy kawie osobiście, hybrydowo albo wyłącznie online, jeśli tak jest Tobie wygodniej.',
        'subtitle' => '',
        'button' => ['text' => 'Jak dojechać', 'href' => '#'],
    ],
    'subpage-light' => DS_HERO_SUBPAGE_COPY,
    'subpage-violet' => DS_HERO_SUBPAGE_COPY,
    'subpage-orange' => DS_HERO_SUBPAGE_COPY,
]);

if (!function_exists('ds_hero_accent_parts')) {
    // accentParts(): the text split around the first occurrence of `accent`, empty parts dropped.
    function ds_hero_accent_parts(mixed $text, mixed $accent): array
    {
        $fullText = ds_string($text);
        $at = ds_truthy($accent) ? strpos($fullText, ds_string($accent)) : false;
        if ($at === false) {
            return [['text' => $text, 'accent' => false]];
        }
        $accentText = ds_string($accent);
        $parts = [
            ['text' => substr($fullText, 0, $at), 'accent' => false],
            ['text' => $accentText, 'accent' => true],
            ['text' => substr($fullText, $at + strlen($accentText)), 'accent' => false],
        ];
        return array_values(array_filter($parts, static fn (array $part): bool => $part['text'] !== ''));
    }
}

if (!function_exists('ds_hero_accent_text')) {
    function ds_hero_accent_text(mixed $text, mixed $accent, string $variant, string $mobile, string $tag, string $className): string
    {
        $parts = '';
        foreach (ds_hero_accent_parts($text, $accent) as $part) {
            $parts .= ds_render_text(['text' => $part['text'], 'variant' => $variant, 'mobile' => $mobile, 'tag' => 'span', 'tone' => $part['accent'] ? 'accent' : 'inherit']);
        }
        return '<' . $tag . ' class="' . $className . '">' . $parts . '</' . $tag . '>';
    }
}

if (!function_exists('ds_render_hero')) {
    function ds_render_hero(array $args = []): string
    {
        [
            'variant' => $variant, 'title' => $title, 'titleAccent' => $titleAccent, 'lead' => $lead, 'leadAccent' => $leadAccent,
            'subtitle' => $subtitle, 'tiles' => $tiles, 'image' => $image, 'imageAlt' => $imageAlt,
            'illustration' => $illustration, 'breadcrumbs' => $breadcrumbs, 'headingTag' => $headingTag,
        ] = $args + [
            'variant' => 'large', 'title' => null, 'titleAccent' => null, 'lead' => null, 'leadAccent' => null,
            'subtitle' => null, 'tiles' => null, 'image' => '', 'imageAlt' => '',
            'illustration' => '', 'breadcrumbs' => [], 'headingTag' => 'h1',
        ];
        $variantName = in_array($variant, DS_HERO_VARIANTS, true) ? $variant : 'large';
        $subpage = str_starts_with($variantName, 'subpage-');
        $copy = DS_HERO_COPY[$variantName];
        $titleText = ds_truthy($title) ? $title : $copy['title'];
        $leadText = ds_truthy($lead) ? $lead : $copy['lead'];
        // An accent given with its own text applies to that text; the variant's accent only to the variant's own copy.
        $titleAccentText = $titleAccent ?? (ds_truthy($title) ? '' : $copy['titleAccent']);
        $leadAccentText = $leadAccent ?? (ds_truthy($lead) ? '' : $copy['leadAccent']);
        $subtitleText = $subtitle ?? $copy['subtitle'];
        // `button` missing takes the variant's button; an explicit null (or false) means none.
        $buttonArgs = $subpage ? null : (array_key_exists('button', $args) ? $args['button'] : $copy['button']);
        $tileList = $subpage ? [] : ($tiles ?? DS_HERO_DEFAULT_TILES);
        $tag = in_array($headingTag, DS_HERO_HEADING_TAGS, true) ? $headingTag : 'h1';

        // Phones: the title reads 3XL (Large, Contact) or as an overline (Subpage); the subpage subtitle is body text.
        $titleMarkup = ds_hero_accent_text($titleText, $titleAccentText, '4xl', $subpage ? 'overline' : '3xl', $tag, 'ds-hero__title');
        $leadVariant = ['large' => 'body', 'contact' => 'lead-large'][$variantName] ?? '3xl';
        $leadMarkup = ds_truthy($leadText) ? ds_hero_accent_text($leadText, $leadAccentText, $leadVariant, '', 'p', 'ds-hero__lead') : '';
        $subtitleMarkup = ds_truthy($subtitleText)
            ? '<div class="ds-hero__subtitle">' . ds_render_text(['text' => $subtitleText, 'variant' => $subpage ? '2xl-medium' : 'lg', 'mobile' => $subpage ? 'body' : '']) . '</div>'
            : '';
        $buttonText = is_array($buttonArgs) ? ($buttonArgs['text'] ?? null) : null;
        $buttonMarkup = ds_truthy($buttonText)
            ? '<div class="ds-hero__buttons">' . ds_render_button(['text' => $buttonText, 'href' => $buttonArgs['href'] ?? '', 'variant' => 'light', 'accentIcon' => true]) . '</div>'
            : '';

        $photo = ds_truthy($image) && !$subpage ? '<img class="ds-hero__photo" src="' . ds_escape_html($image) . '" alt="' . ds_escape_html($imageAlt) . '" fetchpriority="high">' : '';
        $art = ds_truthy($illustration) && $subpage ? '<div class="ds-hero__illustration"><img src="' . ds_escape_html($illustration) . '" alt=""></div>' : '';
        $content = '<div class="ds-hero__content">' . $titleMarkup . $leadMarkup . $subtitleMarkup . $buttonMarkup . '</div>';
        $box = '<div class="ds-hero__box">' . $photo . '<div class="ds-hero__inner">' . $content . $art . '</div></div>';
        $tileMarkup = '';
        if (count($tileList) > 0) {
            $tileMarkup = '<ul class="ds-hero__tiles" role="list">';
            foreach ($tileList as $tile) {
                $tileMarkup .= '<li class="ds-hero__tile">' . ds_render_card_hero_tile(array_merge(['headingTag' => 'h2'], $tile)) . '</li>';
            }
            $tileMarkup .= '</ul>';
        }
        $crumbs = $subpage && count($breadcrumbs) > 0 ? '<div class="ds-hero__crumbs">' . ds_render_breadcrumbs(['items' => $breadcrumbs]) . '</div>' : '';

        $classes = ds_class_list(['ds-hero', 'ds-hero--' . $variantName, $subpage ? 'ds-hero--subpage' : '', $photo !== '' ? 'has-photo' : '']);
        return '<section class="' . $classes . '">' . $box . $tileMarkup . $crumbs . '</section>';
    }
}
