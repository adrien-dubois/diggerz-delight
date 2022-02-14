<?php

namespace App\Normalizer;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Entity normalizer
 */
class EntityNormalizer implements DenormalizerInterface
{
    /** @var EntityManagerInterface **/
    protected $em;

    // We get the service
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Should this denormalizer be applied to the current data?
     * If yes, we call $this->denormalize()
     * 
     * $data => l'id of genre
     * $type => type of class to which we want to denormalize $data
     * 
     * @inheritDoc
     */
    public function supportsDenormalization($data, $type, $format = null)
    {
        

        // Is the class of type is Entity doctrine ?
        // Is the data provided numeric? Like a category ID for example
        // {"title":"Demo", "categories":[1, 2]} where 1 and 2 are existing category IDs
        return strpos($type, 'App\\Entity\\') === 0 && (is_numeric($data));
    }

    /**
     * This method will be called if the above condition is valid
     * 
     * @inheritDoc
     */
    public function denormalize($data, $class, $format = null, array $context = [])
    {
        // Shortcut from the EntityManager to fetch an entity
        return $this->em->find($class, $data);
    }
}