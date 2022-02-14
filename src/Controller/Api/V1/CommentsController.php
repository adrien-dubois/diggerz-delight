<?php

namespace App\Controller\Api\V1;

use App\Entity\Comment;
use App\Repository\CommentRepository;
use App\Repository\PostRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @Route("/api/v1/comments", name="api_v1_comments_", requirements={"id" = "\d+"})
 */
class CommentsController extends AbstractController
{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

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

    /**
     * Post a new comment
     * 
     * @Route("/", name="add", methods={"POST"})
     *
     * @param Request $request
     * @param SerializerInterface $serializer
     * @param ValidatorInterface $validator
     * @param EntityManagerInterface $em
     * @return void
     */
    public function add(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        EntityManagerInterface $em
    )
    {
        // We take back the Json sent
        $jsonData = $request->getContent();

        // We transform the json in object
        // First argument : datas to deserialize
        // Second : The type of object we want
        // Last : Content type

        /** @var Comment @comment */
        $comment = $serializer->deserialize($jsonData, Comment::class, 'json',[AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER]);

        // We validate the datas stucked in $comment on criterias of annotations Entity @assert
        $errors = $validator->validate($comment);

        // If the errors array is not empty, we return a 400 error code for Bad Request
        if(count($errors) > 0){
            return $this->json($errors, 400);
        }

        $user = $this->security->getUser();
        $comment -> setUser($user);

        $em->persist($comment);
        $em->flush();

        return $this->json($comment, 201,[], [
            'groups' => 'comment'
        ]);
    }
}