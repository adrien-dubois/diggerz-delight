<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('fullname', null, [
                'attr' => [
                    'class' => 'user-input',
                    'placeholder' => 'Nom complet'
                ]
            ])
            ->add('email', null, [
                'attr' => [
                    'class' => 'user-input',
                    'placeholder' => 'E-Mail'
                ]
            ])
            
            // Configure the password in two times for the confirmation
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'Les mots de passe doivent être identiques',
                'required' => true,
                'first_options'  => [
                    'attr' => [
                        'class' => 'user-input', 
                        'placeholder' => 'Mot de passe (6 caractères minimum)'
                    ]
                ],
                'second_options' => [
                    'attr' => [
                        'class' => 'user-input', 
                        'placeholder' => 'Confirmez votre mot de passe'
                    ]
                ],
                'mapped' => false,
                'attr' => [
                    'autocomplete' => 'new-password',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Merci de renseigner un mot de passe',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Votre mot de passe doit contenir au moins {{ limit }} caractères',
                        // max length allowed by Symfony for security reasons
                        'max' => 4096,
                    ]),
                ],
            ])
            
            ->add('submit', SubmitType::class,[
                'label' => 'Inscription',
                'attr' =>[
                    'class' => 'btn',
                ]
            ])
            
            ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
