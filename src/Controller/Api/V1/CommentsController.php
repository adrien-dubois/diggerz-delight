<?php

namespace App\Controller\Api\V1;

use App\Repository\CommentRepository;
use App\Repository\PostRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/v1/comments", name="api_v1_comments_", requirements={"id" = "\d+"})
 */
class CommentsController extends AbstractController
{
    /**
     * Get the comments of an articleby its ID
     * 
     * @Route("/poster={id}", name="orderby_articles", methods={"GET"})
     *
     * @return Response
     */
    public function commentsPost(
        int $id,
        CommentRepository $commentRepository,
        PostRepository $postRepository
    )
    {
        $post = $postRepository->find($id);

        $comments = $commentRepository->findBy(['post'=>$post]);

        return $this->json($comments, 200, [], [
            'groups' => 'comment'
        ]);
    }

    /**
     * @Route("/post={id}&page={page}", name="comment_bypage", methods={"GET"}, requirements={"page"="\d+"})
     *
     * @return void
     */
    public function getCommentsByPage(
        int $id, 
        int $page, 
        CommentRepository $commentRepository
    )
    {
        $query = $commentRepository->createQueryBuilder('c')
                                   ->join('c.post', 'post')
                                   ->where('post.id LIKE :id')
                                   ->setParameter(':id', "%$id%")
                                   ->getQuery();
        $pageSize = '5';
        $paginator = new Paginator($query);
        $totalItems = count($paginator);
        $pageCount = ceil($totalItems / $pageSize);

        $paginator
            ->getQuery()
            ->setFirstResult($pageSize * ($page-1))
            ->setMaxResults($pageSize);

            $data['data'] = array (
                'Nb total de comments' => $totalItems,
                'Nb de pages' => $pageCount
            );
        
        return $this->json([$paginator, $data], 200, [], [
            'groups' => 'comment'
        ]);

    }
}
