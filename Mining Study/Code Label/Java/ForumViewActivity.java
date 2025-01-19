package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ForumViewActivity extends AppCompatActivity {

    private SwipeRefreshLayout swipeRefreshLayout;
    private String viewType;
    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum_view);

        String forumId = getIntent().getStringExtra("forumId");
        boolean isJoined = getIntent().getBooleanExtra("isJoined", false);
        String forumName = getIntent().getStringExtra("forumName");

        viewType = "all";

        getAllPosts(forumId);

        if (!isJoined) {
            ((Button) findViewById(R.id.leaveAndJoinButton)).setText(R.string.join_button);
        }

        ((TextView) findViewById(R.id.forumName)).setText(forumName);

        findViewById(R.id.leaveAndJoinButton).setOnClickListener(v -> {
            String joined = (String) ((Button) findViewById(R.id.leaveAndJoinButton)).getText();
            if (joined.equals("Join")) {
                joinForum(forumId);
            } else {
                leaveForum(forumId);
                ((Button) findViewById(R.id.leaveAndJoinButton)).setText(R.string.join_button);
            }
        });

        findViewById(R.id.create_forum_button).setOnClickListener(v -> {
            addPost(forumId, v);
        });

        findViewById(R.id.positiveButton).setOnClickListener(v -> {
            viewType = "positive";
            getFilteredPost(forumId, "positive");
        });

        findViewById(R.id.negativeButton).setOnClickListener(v -> {
            viewType = "negative";
            getFilteredPost(forumId, "negative");
        });

        findViewById(R.id.neutralButton).setOnClickListener(v -> {
            viewType = "neutral";
            getFilteredPost(forumId, "neutral");
        });

        findViewById(R.id.allButton).setOnClickListener(v -> {
            viewType = "all";
            getAllPosts(forumId);
        });


        swipeRefreshLayout = findViewById(R.id.posts_refresh_layout);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                if (viewType.equals("all")) {
                    getAllPosts(forumId);
                } else {
                    getFilteredPost(forumId, viewType);
                }
                swipeRefreshLayout.setRefreshing(false);
            }
        });
    }

    /* ChatGPT usage: No */
    /* https://stackoverflow.com/questions/5545217/back-button-and-refreshing-previous-activity */
    @Override
    public void onRestart()
    {
        super.onRestart();
        finish();
        startActivity(getIntent());
    }

    /* ChatGPT usage: Partial */
    private void getFilteredPost(String forumId, String category) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);

        long startTime = System.currentTimeMillis();

        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("Posts", response.toString());

                long endTime = System.currentTimeMillis();
                long elapsedTime = endTime - startTime;
                Log.d("Timer", "Time taken with to get posts: " + elapsedTime + " milliseconds");

                ((LinearLayout) findViewById(R.id.postsLayoutAll)).removeAllViews();
                for(int i = 0;  i < response.getAsJsonArray().size(); i++) {
                    JsonObject post = response.getAsJsonArray().get(i).getAsJsonObject();
                    Log.d("ForumViewActivity", post.toString());
                    makePostView(post);
                }
            }

            @Override
            public void onApiRequestError(String error) {
                long endTime = System.currentTimeMillis();
                long elapsedTime = endTime - startTime;
                Log.d("Timer", "Time taken with error: " + elapsedTime + " milliseconds");

                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/posts/forum/" + forumId + "?category=" + category, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: No */
    private void leaveForum(String forumId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");
                Toast.makeText(ForumViewActivity.this, "Left forum", Toast.LENGTH_SHORT).show();
                ((Button) findViewById(R.id.leaveAndJoinButton)).setText(R.string.join_button);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeDeleteRequest("/forums/user/" + forumId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void joinForum(String forumId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");
                Toast.makeText(ForumViewActivity.this, "Joined forum", Toast.LENGTH_SHORT).show();
                ((Button) findViewById(R.id.leaveAndJoinButton)).setText(R.string.leave_button);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        JsonObject body = new JsonObject();
        body.addProperty("forumId", forumId);
        try {
            serverRequest.makePostRequest("/forums/user", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void addPost(String forumId, View view) {
        String post = (((EditText) findViewById(R.id.postMessage)).getText()).toString();
        if (post.trim().equals("")) {
            InputMethodManager inputMethodManager = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getApplicationWindowToken(),0);
            Toast.makeText(ForumViewActivity.this, "Please enter a post", Toast.LENGTH_SHORT).show();
            return;
        } else if (post.length() > 20000) {
            InputMethodManager inputMethodManager = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getApplicationWindowToken(),0);
            Toast.makeText(ForumViewActivity.this, "Post is too long, needs to be less than 20,000 characters", Toast.LENGTH_SHORT).show();
            return;
        }

        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @SuppressLint("UnsafeIntentLaunch")
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d(ServerRequest.RequestTag, "Success");
                Log.d("AddPost", response.toString());
                findViewById(R.id.postMessage).clearFocus();
                ((EditText) findViewById(R.id.postMessage)).setText("");
                Log.d("AddPost", response.getAsJsonObject().get("postId").getAsString());
                getPost(response.getAsJsonObject().get("postId").getAsString());
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        JsonObject body = new JsonObject();
        body.addProperty("content", post);
        body.addProperty("forumId", forumId);
        try {
            serverRequest.makePostRequest("/posts", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void getPost(String postId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("GetPost", response.toString());
                JsonObject post = response.getAsJsonObject();
                Log.d("GetPost", post.toString());
                makePostView(post);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/posts/post/" + postId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void getAllPosts(String forumId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                ((LinearLayout) findViewById(R.id.postsLayoutAll)).removeAllViews();
                Log.d("Posts", response.toString());
                for(int i = 0;  i < response.getAsJsonArray().size(); i++) {
                    JsonObject post = response.getAsJsonArray().get(i).getAsJsonObject();
                    Log.d("ForumViewActivity", post.toString());
                    makePostView(post);
                }
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/posts/forum/" + forumId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void addLike(String postId, TextView numberOfLikes, ImageButton likeButton) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");
                likeButton.setImageResource(R.drawable.baseline_thumb_up_alt_24);
                int val = Integer.parseInt((String) numberOfLikes.getText()) + 1;
                numberOfLikes.setText(String.valueOf(val));
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        JsonObject body = new JsonObject();
        body.addProperty("post_id", postId);
        try {
            serverRequest.makePostRequest("/likes", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void removeLike(String postId, TextView numberOfLikes, ImageButton likeButton) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");
                likeButton.setImageResource(R.drawable.baseline_thumb_up_off_alt_24);
                int val = Integer.parseInt((String) numberOfLikes.getText()) - 1;
                numberOfLikes.setText(String.valueOf(val));
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeDeleteRequest("/likes/" + postId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void makePostView(JsonObject post) throws ParseException {
        View postView = getLayoutInflater().inflate(R.layout.post_card, null);
        postView.setTag(post.get("postId").getAsString());
        ((TextView) postView.findViewById(R.id.post_user)).setText(post.get("writtenBy").getAsString());
        ((TextView) postView.findViewById(R.id.post_content)).setText(post.get("content").getAsString());
        ((TextView) postView.findViewById(R.id.number_of_likes)).setText(post.get("likesCount").getAsString());
        ((TextView) postView.findViewById(R.id.number_of_comments)).setText(post.get("commentCount").getAsString());

        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        SimpleDateFormat outputFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss", Locale.US);
        Date date = inputFormat.parse(post.get("dateWritten").getAsString());
        assert date != null;
        String formattedDate = outputFormat.format(date);
        Log.d("ForumViewActivity", formattedDate);
        ((TextView) postView.findViewById(R.id.post_date)).setText(formattedDate);

        if (post.get("userLiked").getAsBoolean()) {
            ((ImageButton) postView.findViewById(R.id.like_button)).setImageResource(R.drawable.baseline_thumb_up_alt_24);
        }

        postView.setOnClickListener(v -> {
            goToPostPage(post, formattedDate);
        });

        postView.findViewById(R.id.comment_button).setOnClickListener(v -> {
            goToPostPage(post, formattedDate);
        });

        ImageButton likeButton = postView.findViewById(R.id.like_button);
        likeButton.setOnClickListener(v -> {
            Drawable imageResource = likeButton.getDrawable();
            Drawable.ConstantState imageButtonState = imageResource.getConstantState();
            Drawable desiredDrawable = getResources().getDrawable(R.drawable.baseline_thumb_up_alt_24);
            Drawable.ConstantState desiredDrawableState = desiredDrawable.getConstantState();
            assert imageButtonState != null;
            if (imageButtonState.equals(desiredDrawableState)) {
                removeLike(post.get("postId").getAsString(), postView.findViewById(R.id.number_of_likes), likeButton);
            } else {
                addLike(post.get("postId").getAsString(), postView.findViewById(R.id.number_of_likes), likeButton);
            }
        });

        postView.findViewById(R.id.report_button).setOnClickListener(v -> {
            showReportPostsDialog(post.get("postId").getAsString(), post.get("userId").getAsString());
        });



        ((LinearLayout) findViewById(R.id.postsLayoutAll)).addView(postView, 0);
    }

    /* ChatGPT usage: No */
    private void goToPostPage(JsonObject post, String date) {
        Intent intent = new Intent(ForumViewActivity.this, PostActivity.class);
        intent.putExtra("userId", post.get("userId").getAsString());
        intent.putExtra("postId", post.get("postId").getAsString());
        intent.putExtra("writtenBy", post.get("writtenBy").getAsString());
        intent.putExtra("content", post.get("content").getAsString());
        intent.putExtra("likesCount", post.get("likesCount").getAsString());
        intent.putExtra("commentCount", post.get("commentCount").getAsString());
        intent.putExtra("userLiked", post.get("userLiked").getAsBoolean());
        intent.putExtra("date", date);
        startActivity(intent);
    }

    /* ChatGPT usage: No */
    /* https://www.geeksforgeeks.org/how-to-create-an-alert-dialog-box-in-android/ */
    private void showReportPostsDialog(String postId, String userId) {
        AlertDialog.Builder builder = new AlertDialog.Builder(ForumViewActivity.this);

        builder.setTitle("Report Post");
        builder.setMessage("Are you sure you want to report this post?");

        builder.setCancelable(false);

        builder.setPositiveButton("Yes", (DialogInterface.OnClickListener) (dialog, which) -> {
            /* https request to report the post here */
            SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
            String userIdReporter = sharedPreferences.getString("userId", null);
            ServerRequest serverRequest = new ServerRequest(userIdReporter);
            ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
                @Override
                public void onApiRequestComplete(JsonElement response) {
                    Log.d(ServerRequest.RequestTag, "Success");

                    /* dialog closes */
                    dialog.cancel();

                    Toast.makeText(ForumViewActivity.this, "Post has been reported.", Toast.LENGTH_SHORT).show();

                }

                @Override
                public void onApiRequestError(String error) {
                    Log.d(ServerRequest.RequestTag, "Failure");
                    Log.d(ServerRequest.RequestTag, error);
                }
            };

            JsonObject body = new JsonObject();
            body.addProperty("postId", postId);
            body.addProperty("userId", userId);


            try {
                serverRequest.makePostRequest("/reports/", body, apiRequestListener);
            } catch (UnsupportedEncodingException e) {
                throw new InternalError(e);
            }


        });

        builder.setNegativeButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {

            /* dialog closes */
            dialog.cancel();
        });

        AlertDialog alertDialog = builder.create();

        alertDialog.show();

    }
}