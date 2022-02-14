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
     * Get all the comments ofone particular Post, with pagination (5 comments per page), most recent first
     * 
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
        // build the query for the doctrine paginator
        $query = $commentRepository->createQueryBuilder('c')
                                   ->join('c.post', 'post')
                                   ->where('post.id LIKE :id')
                                   ->setParameter(':id', "%$id%")
                                   ->orderBy('c.createdAt', 'DESC')
                                   ->getQuery();

        // Set the number of comments per page
        $pageSize = '5';

        // load doctrine Paginator
        $paginator = new Paginator($query);

        // Get total comments
        $totalComments = count($paginator);

        // Same for the pages
        $pageCount = ceil($totalComments / $pageSize);

        // now get one page's items
        $paginator
            ->getQuery()
            ->setFirstResult($pageSize * ($page-1))
            ->setMaxResults($pageSize);

            // Create an array to export pagination information into JSon
            $data['pagination'] = array (
                'Nb total de comments' => $totalComments,
                'Nb de pages' => $pageCount
            );
        
        return $this->json([$paginator, $data], 200, [], [
            'groups' => 'comment'
        ]);

    }

    /**
     * Get a single comment by its ID
     * 
     * @Route("/{id}", name="single", methods={"GET"})
     *
     * @param integer $id
     * @param CommentRepository $repository
     * @return void
     */
    public function getSingleComment(
        int $id,
        CommentRepository $repository
    )
    {
        $comment = $repository->find($id);

        return $this->json($comment,200, [], [
            'groups' => 'comment'
        ]);
        
    }
}
