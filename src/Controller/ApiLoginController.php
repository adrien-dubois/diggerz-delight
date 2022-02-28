<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class ApiLoginController extends AbstractController
{
    /**
     * @Route("/connect", name="connect")
     */
    public function index()
    {
        $user = $this->getUser();
        // dd($user);
        if(!$user){
            
        }

        return $this->json([
            'user' => $user->getUserIdentifier()
        ]);
    }
}
