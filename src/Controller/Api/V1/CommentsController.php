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
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;

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
     * Get all the comments without any classment
     * 
     * @Route("/", name="readAll", methods={"GET"})
     *
     * @param CommentRepository $repository
     * @return JsonResponse
     */
    public function read(CommentRepository $repository)
    {
        $comments = $repository->findAll();

        return $this->json($comments, 200, [], [
            'groups' => 'comment'
        ]);
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
        CommentRepository $commentRepository,
        Request $request
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
        $pageSize = '2';

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
        
        /*----- CALCULATE PAGINATION LINKS ------*/


        $currentPage = $request->get('page');

        for ($page; $page <= $pageCount ; $page++) { 
            
            $url = 'http://localhost:8080/api/v1/comments/post=1&page=' . $page;
        }

            // Create an array to export pagination information into JSon
            $items = ['totalItems' => $totalComments];

            $pages = ['NbPages' => $pageCount];

            $pagination = [
                'current' => 'http://localhost:8080/api/v1/comments/post=1&page=' . $currentPage,
                'last' => $url,
                'previous' => ($currentPage > 1 ? 'http://localhost:8080/api/v1/comments/post=1&page=' . ($currentPage - 1) : ''),
                'next' => ($currentPage < $pageCount ? 'http://localhost:8080/api/v1/comments/post=1&page=' . ($currentPage + 1) : '')
            ];

        
        return $this->json([$items, $pages, $pagination, $paginator], 200, [], [
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

        if(!$comment){
            return $this->json([
                'error' => "Le commentaire demandé n'existe pas"
            ], 404
            );
        }

        return $this->json($comment,200, [], [
            'groups' => 'comment'
        ]);
        
    }

    /**
     * Post a new comment
     * 
     * @Route("/", name="add", methods={"POST"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
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

    /**
     * Method to edit a comment by PUT and PATCH
     * 
     * @Route("/{id}", name="edit", methods={"PUT", "PATCH"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     *
     * @return JsonResponse
     */
    public function edit(
        Comment $comment,
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $em
    )
    {

        $this->denyAccessUnlessGranted('edit', $comment, 'Vous n\'êtes pas l\'auteur de ce commentaire !');

        $jsonData = $request->getContent();

        if(!$comment){
            return $this->json([
                'message' => 'Ce commentaire n\'existe pas'
            ], 404
            );
        }
        
        $serializer->deserialize($jsonData, Comment::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE=>$comment]);

        $em->flush();

        return $this->json(["message" => "Le commentaire a bien été modifié"], 200, [], [
            "groups" => "comment"
        ]);
    }


    
    /**
     * Method to delete a comment with its ID
     * 
     * @Route("/{id}", name="delete", methods={"DELETE"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     *
     * @param Comment $comment
     * @param EntityManagerInterface $em
     * @return JsonResponse
     */
    public function delete(Comment $comment, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('delete', $comment, 'Vous n\'avez pas écrit ce commentaire');

        if(!$comment){
            return $this->json([
                'error' => 'Ce commentaire n\'existe pas!'
            ],404
            );
        }

        $em -> remove($comment);
        $em -> flush();

        return $this->json(['ok' => "Le commentaire a bien été supprimé"], 200,[],[]);
    }
}
