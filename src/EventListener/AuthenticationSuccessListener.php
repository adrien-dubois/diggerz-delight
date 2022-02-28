<?php

namespace App\EventListener;


use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener{

    private $repository;
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(UserRepository $repository, UrlGeneratorInterface $urlGenerator)
    {
        $this->repository = $repository;
        $this->urlGenerator = $urlGenerator;
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