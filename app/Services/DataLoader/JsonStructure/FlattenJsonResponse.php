<?php

namespace App\Services\DataLoader\JsonStructure;

final readonly class FlattenJsonResponse
{
    /**
     * Summary of flatten
     *
     * @param  mixed[]  $data
     * @return array<int, array<string, string|int|float|null>>
     */
    public function flatten(array $data, string $separator = '.', string $startingPrefix = ''): array
    {
        if (is_array($data) && $this->isSequentialArray($data)) {
            $result = [];
            foreach ($data as $index => $item) {
                $flattenedItem = $this->flattenItem($item, $separator, $startingPrefix);
                if (is_array($flattenedItem) && $this->isSequentialArray($flattenedItem)) {
                    $result = [
                        ...$result,
                        ...$flattenedItem,
                    ];

                    continue;
                }
                //if its not an array then add to result
                $result[] = $flattenedItem;
            }

            return $result;
        }

        $flattened = $this->flattenItem($data, $separator, $startingPrefix);

        if (is_array($flattened) && $this->isSequentialArray($flattened)) {
            return $flattened;
        }

        return [$flattened];
    }

    private function flattenItem(array $data, string $separator, string $prefix): array
    {
        $result = [];

        //for processing object
        if (is_array($data) && ! $this->isSequentialArray($data)) {
            $primitives = [];
            $childRows = [];

            foreach ($data as $key => $value) {
                //if the  value is not an array, we can add it directly to the primitives
                if (! is_array($value)) {
                    $primitives["$prefix.$key"] = $value;
                }
                //for processing child object
                if (is_array($value) && ! $this->isSequentialArray($value)) {
                    $flattenedChild = $this->flattenItem($value, $separator, "$prefix.$key");
                    //if child is sequential then insert to child rows
                    if (is_array($flattenedChild) && $this->isSequentialArray($flattenedChild)) {
                        $childRows = [
                            ...$childRows,
                            ...$flattenedChild,
                        ];
                    } elseif (is_array(value: $flattenedChild)) {
                        //if child is not sequential then insert to primitives
                        $primitives = [
                            ...$primitives,
                            ...$flattenedChild,
                        ];
                    } else {
                        //is not an array
                        $primitives["$prefix.$key"] = $flattenedChild;
                    }

                }
                //the field is an array
                if (is_array($value) && $this->isSequentialArray($value)) {
                    $flattenedArray = $this->flattenItem($value, $separator, "$prefix.$key");
                    if (is_array($flattenedArray) && $this->isSequentialArray($flattenedArray)) {
                        $childRows = [
                            ...$childRows,
                            ...$flattenedArray,
                        ];
                    } elseif (is_array(value: $flattenedArray)) {
                        $primitives = [
                            ...$primitives,
                            ...$flattenedArray,
                        ];
                    } else {
                        //if its not an array then add to primitives
                        $primitives["$prefix.$key"] = $flattenedArray;
                    }
                }
            }
            if (empty($childRows)) {
                return $primitives;
            }
            //add primitives to each child row
            foreach ($childRows as $childRow) {
                $result[] = [
                    ...$childRow,
                    ...$primitives,
                ];
            }
        }

        //for processing array
        if (is_array($data) && $this->isSequentialArray($data)) {
            foreach ($data as $item) {
                //when its primitive array
                if (! is_array($item)) {
                    $result[] = [
                        $prefix => $item,
                    ];

                    continue;
                }
                //array of objects
                $flattenedItem = $this->flattenItem($item, $separator, $prefix);
                if (is_array($flattenedItem) && $this->isSequentialArray($flattenedItem)) {
                    $result = [
                        ...$result,
                        ...$flattenedItem,
                    ];
                } else {
                    $result[] = $flattenedItem;
                }
            }
        }

        return $result;
    }

    private function isSequentialArray(array $array): bool
    {
        return array_keys($array) === range(0, count($array) - 1);
    }
}
