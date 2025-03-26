<?php

namespace App\Services\DataLoader\JsonStructure;

class FindJsonPrimaryField
{
    /**
     * @return JsonDefinition[]
     */
    public function findPathToPrimary(JsonDefinition $definition): array
    {

        if ($definition->primaryField) {
            return [$definition];
        }

        foreach ($definition->children as $child) {
            $pathToPrimary = $this->findPathToPrimary($child);

            if (! empty($pathToPrimary)) {
                return [
                    $definition,
                    ...$pathToPrimary,
                ];
            }
        }

        return [];

    }
}
