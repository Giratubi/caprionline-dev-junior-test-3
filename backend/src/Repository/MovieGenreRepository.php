<?php

namespace App\Repository;

use App\Entity\MovieGenre;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MovieGenre>
 *
 * @method MovieGenre|null find($id, $lockMode = null, $lockVersion = null)
 * @method MovieGenre|null findOneBy(array $criteria, array $orderBy = null)
 * @method MovieGenre[]    findAll()
 * @method MovieGenre[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieGenreRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MovieGenre::class);
    }

    public function findMoviesByGenre($genreId)
    {
        $entityManager = $this->getEntityManager();
        $query = $entityManager->createQuery(
            "SELECT m FROM App\Entity\Movie m JOIN m.movieGenres mg JOIN mg.genre g WHERE g.id = :genreId"
        )->setParameter('genreId', $genreId);

        return $query->getResult();
    }

    //    /**
    //     * @return MovieGenre[] Returns an array of MovieGenre objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?MovieGenre
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
