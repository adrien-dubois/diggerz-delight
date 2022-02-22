<?php

namespace App\Controller\Api\V1;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/api/v1/me", name="api_v1_me_")
 */
class MeController extends AbstractController{

    private $security;

    public function __construct(Security $security){
        $this->security = $security;
    }


    public function __invoke()
    {
        $user = $this->security->getUser();

        return $user ;
    }
}
