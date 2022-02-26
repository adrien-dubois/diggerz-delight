<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class ApiLoginController extends AbstractController
{

    /**
     * @Route("/login", name="app_login", methods={"POST"})
     */
    public function index(Request $request)
    {
        // $test = $request;
        // dd($test);

        return $this->json([
            'user' => $this->getUser(),
        ]);
    }
}
