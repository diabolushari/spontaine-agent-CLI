<?php

use function Pest\Laravel\assertGuest;
use function Pest\Laravel\get;

it('main url redirects to dashboard', function () {
    $response = get('/');
    assertGuest();
    $response->assertStatus(302);
    $response->assertRedirect(route('dashboard'));
});
