<?php

declare(strict_types=1);

namespace App\Listener;

use App\Security\JwtPayloadContainer;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;

class JwtPayloadListener {

    private JwtPayloadContainer $jwtPayloadContainer;

    public function __construct(JwtPayloadContainer $jwtPayloadContainer)
    {
        $this->jwtPayloadContainer = $jwtPayloadContainer;
    }

    public function onJwtDecoded(JWTDecodedEvent $event): void
    {
        $payload = $event->getPayload();
        $this->jwtPayloadContainer->setPayload($payload);
    }
}