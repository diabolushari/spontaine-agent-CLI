<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestGuzzleHttpController extends Controller
{
    /**
     * Execute a test GET request using GuzzleHTTP
     */
    public function index(Request $request): JsonResponse
    {
        $client = new Client();

        try {
            // Retrieve bearer token from the incoming request, or specify a hardcoded one
            $token = $request->bearerToken() ?? 'eyJraWQiOiJjLlRTVERSVjE5MDc2NDUuMjAyNi0wMy0xM18wMi0xOC00NyIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzOzg3NTEiLCJhdWQiOlsiNDY4NTVGNDAtRjBBMC00MDgwLTgzM0EtN0FDODExNkQzNEZDO1RTVERSVjE5MDc2NDUiLCI1M2Q5N2NiZGFlNTdlYThlOTA2OTYzOTI3OWEyMmQ4ZTliMjZlNGQyZTk2MjBiMDRkYmFjOTVjZDAyZjE2YjA3Il0sInNjb3BlIjpbInJlc3Rfd2Vic2VydmljZXMiLCJyZXN0bGV0cyJdLCJpc3MiOiJodHRwczovL3N5c3RlbS5uZXRzdWl0ZS5jb20iLCJvaXQiOjE3NzQyNDQyMjMsImV4cCI6MTc3NDI0NzgyMywiaWF0IjoxNzc0MjQ0MjIzLCJqdGkiOiJUU1REUlYxOTA3NjQ1LmEtYy5udWxsLjE3NzQyNDQyMjM0OTcifQ.azA7jidkgxUqP68fr_YHuXYfcfkokZpVOeFSyXhyuq5lnigy7wSlM0kSWpEe3tSha1OkpS0drt1gzwZaYGJKz1JSI1v4C0nZvcDcO2ltvELFP4UHwLmpQ4LZGPctNCFOwxzoW51v4emfZqGWWd7p-aRj-i5J3IlPXcYlYeOcHLRW1eV_Fv0G2_FM2V2GbKgrILm0zbgnTgBhvuPd0hRuddaUmcvY4nMSqo5iXfMNqpdswTro-LkimJ29zym3q8iPg7752UVRQU0PRLVHQOzw5SUO-aXUWquDYrpQVmkJeQa_JPg3o80mZzQZ3Qlgr4bpz7ghs5i6wu2Kp5uFLJTKn_PZWidaxp_l_imdNp2X5v60C8gMfbTxVNfTodDs4u7qyfQAHXAzat69ikRYv_bJuog_tCq1Rn0Gj2d8WvFQwF-TDGqi92oCUFk7oybsMSutsfLoTGFbdTNeYBaBTulVPzmBHjqDrn3Z1h3pV9KULLfPooKxTovmBcrN4_FThN1p9Qxhiw377QOjlIALqMa2y2KsMiRJF7YbGxItNRSqxAUjA9qW7krH63-SmkrH-T8iwHct9K7FoXLd_KqqBweOVbLIzgLSidT7moJCep4_8PFKDxoLywL5SLO6dEv55uaqkQfGj6Q6BI8GjZ2bBZvuuvHaoqsAv8v-JLC3nHNEuL0';

            // Making a basic GET request with Authorization and Content-Type headers
            $response = $client->request('GET', 'https://tstdrv1907645.restlets.api.netsuite.com/app/site/hosting/restlet.nl', [
                'query' => array_merge([
                    'script' => '3944',
                    'deploy' => '1',
                ], $request->query()),
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'Accept'        => 'application/json',
                    'Content-Type'  => 'application/json',
                ],
            ]);
            $data = json_decode($response->getBody()->getContents(), true);

            return response()->json([
                'success' => true,
                'message' => 'GuzzleHttp GET request successful',
                'data' => $data,
            ]);
        } catch (GuzzleException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error occurred during Guzzle HTTP request',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
