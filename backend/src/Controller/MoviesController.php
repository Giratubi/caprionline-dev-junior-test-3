<?php

namespace App\Controller;

use App\Repository\MovieRepository;
use App\Repository\GenreRepository;
use App\Repository\MovieGenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private  GenreRepository $genreRepository,
        private MovieGenreRepository $movieGenreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function listMovies(): JsonResponse
    {
        $movies = $this->movieRepository->findAll();
        $data = $this->serializer->serialize($movies, "json", ["groups" => "default"]);
        return new JsonResponse($data, json: true);
    }

    #[Route('/genres', methods: ['GET'])]
    public function listGenres(): JsonResponse
    {
        $genres = $this->genreRepository->findAll();
        $data = $this->serializer->serialize($genres, "json");
        return new JsonResponse($data, json:true);
    }

    #[Route('/movies/genre/{genreId}', methods: ['GET'])]
    public function getMoviesByGenre(int $genreId): JsonResponse
    {
        $movies = $this->movieGenreRepository->findMoviesByGenre($genreId);
        if (empty($movies)) {
            return $this->json([], 200);
        }
        return $this->json($movies, context: ['groups' => ['default']]);
    }
}