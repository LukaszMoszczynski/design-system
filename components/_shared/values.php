<?php
// JavaScript value rules for the PHP twins, so a twin decides exactly as its template.js does.
// Plain PHP 8.4, no WordPress functions; safe to require from several twins.
declare(strict_types=1);

if (!function_exists('ds_truthy')) {
    // JS truthiness: false, null, 0, 0.0, NAN and '' are falsy; everything else ('0', [], objects) is truthy.
    function ds_truthy(mixed $value): bool
    {
        if ($value === null || $value === false || $value === '' || $value === 0) {
            return false;
        }
        if (is_float($value)) {
            return $value !== 0.0 && !is_nan($value);
        }
        return true;
    }
}

if (!function_exists('ds_string')) {
    // JS String(value): true → "true", 1.5 → "1.5", 2.0 → "2", null → "null", a list → its items joined by ",".
    function ds_string(mixed $value): string
    {
        if ($value === null) {
            return 'null';
        }
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }
        if (is_float($value)) {
            if (is_nan($value)) {
                return 'NaN';
            }
            if (is_infinite($value)) {
                return $value > 0 ? 'Infinity' : '-Infinity';
            }
            if (floor($value) === $value && abs($value) < 1e21) {
                return number_format($value, 0, '.', '');
            }
            return (string) json_encode($value);
        }
        if (is_array($value)) {
            return array_is_list($value)
                ? implode(',', array_map(static fn (mixed $item): string => $item === null ? '' : ds_string($item), $value))
                : '[object Object]';
        }
        return (string) $value;
    }
}

if (!function_exists('ds_number')) {
    // JS Number(value): numbers as they are, numeric strings parsed, '' / null / false → 0, true → 1, else NAN.
    function ds_number(mixed $value): int|float
    {
        if (is_int($value) || is_float($value)) {
            return $value;
        }
        if ($value === null || $value === false) {
            return 0;
        }
        if ($value === true) {
            return 1;
        }
        if (is_string($value)) {
            $trimmed = trim($value);
            if ($trimmed === '') {
                return 0;
            }
            return is_numeric($trimmed) ? $trimmed + 0 : NAN;
        }
        return NAN;
    }
}

if (!function_exists('ds_pick')) {
    // The keys of $source that are present, as JS passes { text: item.text } (a missing key stays missing, so the
    // callee's default applies; null stays null).
    function ds_pick(array $source, array $keys): array
    {
        return array_intersect_key($source, array_flip($keys));
    }
}

if (!function_exists('ds_class_list')) {
    // [a, b, ''].filter(Boolean).join(' ').
    function ds_class_list(array $classes): string
    {
        return implode(' ', array_map('ds_string', array_values(array_filter($classes, 'ds_truthy'))));
    }
}
