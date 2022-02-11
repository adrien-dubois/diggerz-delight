<?php

namespace App\Controller;

use App\Entity\Post;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


/**
 * @Route("/post", name="post_")
 */
class PostController extends AbstractController
{


    /**
     * Method displaying a single article by its ID
     * 
     * @Route("/{id}", name="single", requirements = {"id" = "\d+"})
     */
    public function single(Post $post): Response
    {
        // $id = $post->getId();

        if(!$post){
            throw $this->createNotFoundException('L\'article demandé n\'existe pas');
        } 
        
        return $this->render('post/single.html.twig', [
            'post' => $post,
        ]);
    }
}
