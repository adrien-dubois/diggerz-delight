# Blog - Diggerz Delight

This side project is a blog Symfony project about hiphop culture from the 80/90's in NYC. Posts to make the parallel with the current movement, and see the difference and inspirations.

After a School project, an E-commerce, and a Portfolio, I wanted to make a blog to expand my knowledge.

## `Technos`

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="Html logo" title="Html" height="25" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS logo" title="CSS" height="25"/> <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP logo" title="PHP" height="25"/> <img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white" alt="JQuery logo" title="JQuery" height="25" /> <img src="https://img.shields.io/badge/Symfony-282C34?logo=symfony&logoColor=3DDC84" alt="Symfony logo" title="Symfony" height="25" />

The base of the project is Symfony & Twig for sure, I will use Doctrine's ORM for the database. 
All the CRUD for controllers will be by hand, not with Make command.
And the webdesign will be pure HTML / CSS.

For all front part I installed Webpack Encore which will manage front side.
A little bit of JQuery for some JS features, Fonteawesome for pictos andsome dependencies for features like Carousel etc...


The README will be update with project as things progress.

### `Dependencies`

- Webpack Encore
- Jquery : `3.6.0`
- Font Awesome : `6.0`
- AOS : `3.0.0-beta 6`
- Owl Carousel : `2.3.4`
- Nelmio Cors Bundle: `2.2`
- Lexik JWT Authentication: `2.14` *generate keys with `php bin/console lexik:jwt:generate-keypair` Your keys will land in config/jwt/private.pem and config/jwt/public.pem*
 *Configure the SSL keys path and passphrase in your .env -> move it to your .env.local to gitignore*
 *And add token_ttl in `config/packages/lexik_jwt_authentication.yaml`*
  
  
#### **_To display the date in french_**
- Twig extra bundle: `3.0`
- Twig string extra: `3.3`
  
The date filter in Twig is not well suited for localized date formatting, as it is based on PHP's DateTime::format. One option would be to use the localizeddate filter instead

This extension is not delivered on a default Symfony installation. You will find it in the official Twig extensions repository :

`$ composer require twig/extensions` 

Then, just declare this extension as a service in services.yml for instance :

```yaml
services:
    twig.extension.intl:
        class: Twig_Extensions_Extension_Intl
        tags:
            - { name: twig.extension }
```

And then in your twig file :

```html
{{ article.date_de_publication|localizeddate('none', 'none', 'fr', null, 'EEEE d MMMM Y') }}
```

### E-mail with new Mailer Interface

### `Configure the mail and send it`

Using the new mailer, instead of SwiftMailer

First, configure the MailerDSN in .env and move on in .env.local to gitignore your mail access.

In the method, use MailerInterface, create a variable for the mail, like `$email` and store new TemplatedMail.

```php
$email = (new TemplatedEmail())
        ->from('your email')
        ->to($user->getEmail())
        ->subject('mail subject')
        ->htmlTemplate('emails/email.html.twig')
        ->context([
            'expiration' => new \DateTime('+7 days'),
            'name'       => $user->getFullName(),
            'otp'        => $user->getOtp(),
            'token'      => $user->getActivationToken(),
        ]);
$mailer->send($email);
```

Context is for all the variable you want to pass in your twig mail template.

### `Designing your twig template mail`

__*Images*__
For the twig template, if you want to use images, configure the file where are your images in `config\packages\twig.yaml`

```yaml
twig:
    paths:
            # point this wherever your images live
            '%kernel.project_dir%/assets/img': images
```

Now, use the special `email.image()` Twig helper to embed the images inside the email contents:

```html
<!-- '@images/' refers to the Twig namespace defined earlier -->
<img src="{{ email.image('@images/logo.png') }}" alt="Logo">

<h1>Welcome {{ email.toName }}!</h1>
```

__*CSS Atributes*__

Designing the HTML contents of an email is very different from designing a normal HTML page. For starters, most email clients only support a subset of all CSS features. In addition, popular email clients like Gmail don't support defining styles inside <style> ... </style> sections and you must inline all the CSS styles.

CSS inlining means that every HTML tag must define a style attribute with all its CSS styles. This can make organizing your CSS a mess. That's why Twig provides a CssInlinerExtension that automates everything for you. Install it with:

`$ composer require twig/extra-bundle twig/cssinliner-extra`

The extension is enabled automatically. To use it, wrap the entire template with the `inline_css filter`

```html
{% apply inline_css %}
    <style>
        /* here, define your CSS styles as usual  */
        h1 {
            color: #333;
        }
    </style>

    <h1>Welcome {{ email.toName }}!</h1>
    {# ... #}
{% endapply %}
```