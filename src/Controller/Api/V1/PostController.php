<?php

namespace App\Controller\Api\V1;

use App\Entity\Post;
use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/v1/post", name="api_v1_post_", requirements={"id"="\d+"})
 */
class PostController extends AbstractController
{
    
    /**
     * Read a single post by its ID
     * 
     * @Route("={id}", name="readSingle", methods={"GET"})
     *
     * @param PostRepository $postRepository
     * @param integer $id
     * @return JsonResponse
     */
    public function readSingle(
        PostRepository $postRepository,
        int $id
    )
    {
        $post = $postRepository->find($id);

        if(!$post){
            return $this->json([
                'error' => "L'article demandé n'existe pas"
            ],404
            );
        }

        return $this->json($post, 200, [],[
            'groups' => 'post'
        ]
            
        );
    }


    /**
     * Read the all post list
     * 
     * @Route("/", name="readAll", methods={"GET"})
     *
     * @param PostRepository $repository
     * @return void
     */
    public function readAll(
        PostRepository $repository
    )
    {
        $post = $repository->findAll();

        return $this->json($post, 200, [], [
            'groups' => 'post'
        ]);
    }
}
