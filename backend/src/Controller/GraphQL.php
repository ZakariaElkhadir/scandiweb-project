<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

class GraphQL
{
    static public function handle()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
        try {
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'products' => [
                        // This returns a list of Product objects (AbstractProduct subclasses)
                        'type' => Type::listOf(
                            new ObjectType([
                                'name' => 'Product',
                                'fields' => [
                                    'id' => [
                                        'type' => Type::id(),
                                        'resolve' => function ($root) {
                                            return $root->getDetails()['id'];
                                        }
                                    ],
                                    'name' => [
                                        'type' => Type::string(),
                                        'resolve' => function ($root) {
                                            // Either use getDetails() or direct properties
                                            return $root->getDetails()['name'];
                                        }
                                    ],
                                    'price' => [
                                        'type' => Type::float(),
                                        'resolve' => function ($root) {
                                            return $root->getDetails()['price'];
                                        }
                                    ],
                                    'images' => [
                                        'type' => Type::listOf(Type::string()),
                                        'resolve' => function ($root) {
                                            return $root->getDetails()['images'];
                                        }
                                    ],
                                    'category_name' => [
                                        'type' => Type::string(),
                                        'resolve' => function ($root) {
                                            return $root->getDetails()['category_name'];
                                        }
                                    ],
                                    'in_stock' => [
                                        'type' => Type::int(),
                                        'resolve' => function ($root) {
                                            return $root->getDetails()['in_stock'];
                                        }
                                    ]
                                ]
                            ])
                        ),
                        'resolve' => function () {
                            $product = new \Models\Products\Product();
                            return $product->getAllProducts();
                        },
                    ],
                ],
            ]);

            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'sum' => [
                        'type' => Type::int(),
                        'args' => [
                            'x' => ['type' => Type::int()],
                            'y' => ['type' => Type::int()],
                        ],
                        'resolve' => static fn($calc, array $args): int => $args['x'] + $args['y'],
                    ],
                ],
            ]);

            // See docs on schema options:
            // https://webonyx.github.io/graphql-php/schema-definition/#configuration-options
            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType instanceof ObjectType ? $queryType : null)
                    ->setMutation($mutationType instanceof ObjectType ? $mutationType : null)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }


        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}