<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="homepage")
     */
    public function index(PostRepository $repository, CategoryRepository $categoryRepository): Response
    {
        $posts = $repository->findAll();

        // Taking the 3 posts which are most commented with the custom query findTopPosts
        $topPosts = $repository->findTopPosts();

        $categories = $categoryRepository->findAll();

        return $this->render('home/index.html.twig', [
            'posts'      => $posts,
            'categories' => $categories,
            'topPosts'   => $topPosts,
        ]);
    }
}
