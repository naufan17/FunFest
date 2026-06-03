<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // Handle specific exceptions
        if ($exception instanceof AuthenticationException) {
            return $this->handleAuthenticationException($request);
        }

        if ($exception instanceof AuthorizationException) {
            return $this->handleAuthorizationException($request);
        }

        if ($exception instanceof ModelNotFoundException) {
            return $this->handleModelNotFound($request);
        }

        if ($exception instanceof NotFoundHttpException) {
            return $this->handleNotFound($request);
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            return $this->handleMethodNotAllowed($request);
        }

        if ($exception instanceof HttpException) {
            return $this->handleHttpException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Handle authentication exceptions
     */
    protected function handleAuthenticationException(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'))
            ->with('error', 'Please log in to access this page.');
    }

    /**
     * Handle authorization exceptions (403)
     */
    protected function handleAuthorizationException(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'This action is unauthorized.'], 403);
        }

        return Inertia::render('Error', ['status' => 403])
            ->toResponse($request)
            ->setStatusCode(403);
    }

    /**
     * Handle model not found exceptions (404)
     */
    protected function handleModelNotFound(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        return Inertia::render('Error', ['status' => 404])
            ->toResponse($request)
            ->setStatusCode(404);
    }

    /**
     * Handle not found exceptions (404)
     */
    protected function handleNotFound(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Not found.'], 404);
        }

        return Inertia::render('Error', ['status' => 404])
            ->toResponse($request)
            ->setStatusCode(404);
    }

    /**
     * Handle method not allowed exceptions (405)
     */
    protected function handleMethodNotAllowed(Request $request)
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Method not allowed.'], 405);
        }

        return Inertia::render('Error', ['status' => 405])
            ->toResponse($request)
            ->setStatusCode(405);
    }

    /**
     * Handle general HTTP exceptions
     */
    protected function handleHttpException(Request $request, HttpException $exception)
    {
        $statusCode = $exception->getStatusCode();

        // List of supported error status codes
        $supportedCodes = [
            400, // Bad Request
            401, // Unauthorized
            403, // Forbidden
            404, // Not Found
            405, // Method Not Allowed
            408, // Request Timeout
            409, // Conflict
            410, // Gone
            413, // Payload Too Large
            414, // URI Too Long
            415, // Unsupported Media Type
            419, // Page Expired
            429, // Too Many Requests
            500, // Internal Server Error
            501, // Not Implemented
            502, // Bad Gateway
            503, // Service Unavailable
            504, // Gateway Timeout
        ];

        if (in_array($statusCode, $supportedCodes)) {
            if ($request->expectsJson()) {
                return response()->json(
                    ['message' => $exception->getMessage() ?: 'Error'],
                    $statusCode
                );
            }

            return Inertia::render('Error', ['status' => $statusCode])
                ->toResponse($request)
                ->setStatusCode($statusCode);
        }

        // For unsupported codes, return a generic error response
        if ($request->expectsJson()) {
            return response()->json(
                ['message' => 'An error occurred.'],
                $statusCode
            );
        }

        return parent::render($request, $exception);
    }
}
