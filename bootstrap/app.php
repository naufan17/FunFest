<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle Authentication Exception (401)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            return redirect()->guest(route('login'))
                ->with('error', 'Please log in to access this page.');
        });

        // Handle Authorization Exception (403)
        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'This action is unauthorized.'], 403);
            }

            return Inertia::render('Error', ['status' => 403])
                ->toResponse($request)
                ->setStatusCode(403);
        });

        // Handle Model Not Found Exception (404)
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Resource not found.'], 404);
            }

            return Inertia::render('Error', ['status' => 404])
                ->toResponse($request)
                ->setStatusCode(404);
        });

        // Handle Not Found Exception (404)
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Not found.'], 404);
            }

            return Inertia::render('Error', ['status' => 404])
                ->toResponse($request)
                ->setStatusCode(404);
        });

        // Handle Method Not Allowed Exception (405)
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Method not allowed.'], 405);
            }

            return Inertia::render('Error', ['status' => 405])
                ->toResponse($request)
                ->setStatusCode(405);
        });

        // General HTTP Exception Handler (covers most error codes)
        $exceptions->render(function (HttpException $e, Request $request) {
            $statusCode = $e->getStatusCode();

            // List of supported error status codes
            $supportedCodes = [
                400, 401, 403, 404, 405, 408, 409, 410, 
                413, 414, 415, 419, 429, 500, 501, 502, 503, 504
            ];

            if (in_array($statusCode, $supportedCodes)) {
                if ($request->expectsJson()) {
                    return response()->json(
                        ['message' => $e->getMessage() ?: 'An error occurred'],
                        $statusCode
                    );
                }

                return Inertia::render('Error', ['status' => $statusCode])
                    ->toResponse($request)
                    ->setStatusCode($statusCode);
            }

            return $e;
        });

        // Handle Token Mismatch Exception (419)
        $exceptions->respond(function (Response $response, \Throwable $e, Request $request) {
            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'message' => 'The page expired, please try again.',
                ]);
            }

            return $response;
        });
    })->create();
