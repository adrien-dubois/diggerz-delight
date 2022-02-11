<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\OtpType;
use App\Form\RegistrationFormType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegistrationController extends AbstractController
{
    /**
     * @Route("/register", name="app_register")
     */
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager, MailerInterface $mailer): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // encode the plain password
            $user->setPassword(
            $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );
            $otp = rand(100000, 999999);

            // Token generate
            $user->setActivationToken(md5(uniqid()));
            $user->setOtp($otp);

            $entityManager->persist($user);
            $entityManager->flush();

            // Send mail

            $email = (new TemplatedEmail())
                    ->to($user->getEmail())
                    ->subject('Validation de votre inscription sur Diggerz Delight')
                    ->htmlTemplate('emails/confirmation.html.twig')
                    ->context([
                        'expiration' => new \DateTime('+7 days'),
                        'name'       => $user->getFullName(),
                        'otp'        => $user->getOtp(),
                        'token'      => $user->getActivationToken(),
                    ]);
            $mailer->send($email);
            
            // Send flash
            $this->addFlash(
                'success',
                'Vous venez de recevoir votre code d\'activation par e-mail'
            );

            return $this->redirectToRoute('homepage');
        }

        return $this->render('security/login.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    /**
     * Activation by mail method
     * 
     * @Route("/activation/{token}", name="activation")
     *
     * @param [type] $token
     * @param UserRepository $userRepository
     * @return void
     */
    public function activation($token, UserRepository $userRepository, Request $request, EntityManagerInterface $entityManager){

        $form = $this->createForm(OtpType::class);
        $activate = $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            
            $otp = $activate->get('otp')->getData();
            /** @var User $user */
            $user = $userRepository->findOtp($otp, $token);

            if(!$user){
                throw $this->createNotFoundException('Le numéro d\'activation est invalide');
            }

            $user->setActivationToken(null);
            $entityManager->flush();

            $this->addFlash(
                'success',
                'Votre compte est bien activé'
            );

            return $this->redirectToRoute('app_login');
        }

        return $this->render('security/activation.html.twig',[
            'formView' => $form->createView(),
        ]);
    }
}
