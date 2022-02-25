<?php

namespace App\EventListener;


use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener{

    private $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event){

        $data = $event->getData();
        $user = $event->getUser();
        // dd($data, $user);
        // dd('authentication success');

        if(!$user instanceof UserInterface){
            return;
        }

        $users = $user->getUserIdentifier();

        $find = $this->repository->findOneBy(['email' => $users]);
        $name = $find->getFullName();
        $id = $find->getId();
        $role = $find->getRoles();
        $mail = $find->getEmail();

        $data['data'] = array(
            'id' => $id,
            'username' => $mail,
            'full_name' => $name,
            'roles' => $role
        );

        $event->setData($data);
    }
}