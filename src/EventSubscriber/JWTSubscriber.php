<?php

namespace App\EventSubscriber;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTSubscriber implements EventSubscriberInterface
{
    private $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }
    
    public function onLexikJwtAuthenticationOnJwtCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $user = $event->getUser();


        $users = $user->getUserIdentifier();
        $find = $this->repository->findOneBy(['email' => $users]);
        
        
        $user = $event->getUser();
        
        $payload          = $event->getData();  
        $payload['id'] = $find->getId();
        $payload['roles'] = $user->getRoles();
        $payload['email'] = $user->getUserIdentifier();
        $payload['exp']   = (new \DateTimeImmutable())->getTimestamp() + 86400;

        $event->setData($payload);
    }

    public static function getSubscribedEvents()
    {
        return [
            'lexik_jwt_authentication.on_jwt_created' => 'onLexikJwtAuthenticationOnJwtCreated',
        ];
    }
}
