<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tag_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tag_user');
    }
};


//mosh noderes
// User model
// public function tags()
// {
//     return $this->belongsToMany(Tag::class);
// }

// // Tag model
// public function users()
// {
//     return $this->belongsToMany(User::class);
// }
// AI-generated code. Review and use carefully. More info on FAQ.
// With these relationships defined, you can attach or detach tags for a user like this:

// PHP

// $user = User::find($userId);
// $tag = Tag::find($tagId);

// // Attach a tag to a user
// $user->tags()->attach($tagId);

// // Detach a tag from a user
// $user->tags()->detach($tagId);