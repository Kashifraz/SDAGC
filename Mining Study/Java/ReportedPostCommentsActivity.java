package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ReportedPostCommentsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reported_post_comments);

        Intent intent = getIntent();
        String userId = intent.getStringExtra("userId");
        String name = intent.getStringExtra("name");

        ((TextView) findViewById(R.id.reportPostCommentsName)).setText("The Reported Posts and Comments for " + name);


        getAllReportedPostsComments(userId);
    }


    /* ChatGPT usage: None */
    public void getAllReportedPostsComments(String userId) {
        /* request to get all reported posts/comments */
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userIdReporter = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userIdReporter);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("Reported Posts/Comments", response.toString());
                ((LinearLayout) findViewById(R.id.reportedPostCommentsLayoutAll)).removeAllViews();

                for(int i = 0;  i < response.getAsJsonArray().size(); i++) {
                    JsonObject reportedPostComment = response.getAsJsonArray().get(i).getAsJsonObject();
                    Log.d("ReportedPostCommentsActivity", reportedPostComment.toString());
                    showReportedPostComment(reportedPostComment);

                }
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/reports/user/" + userId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    public void showReportedPostComment(JsonObject content) throws ParseException {
        View reportedPostCommentView = getLayoutInflater().inflate(R.layout.reported_posts_comments_card, null);

        String writtenBy = content.get("writtenBy").getAsString();
        String dateWritten = content.get("dateWritten").getAsString();
        String reportedContent = content.get("content").getAsString();

        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        SimpleDateFormat outputFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss", Locale.US);
        Date date = inputFormat.parse(dateWritten);
        assert date != null;
        String formattedDate = outputFormat.format(date);

        ((TextView) reportedPostCommentView.findViewById(R.id.reported_user)).setText(writtenBy);
        ((TextView) reportedPostCommentView.findViewById(R.id.post_comment_date)).setText(formattedDate);
        ((TextView) reportedPostCommentView.findViewById(R.id.post_comment_content)).setText(reportedContent);

        ((LinearLayout) findViewById(R.id.reportedPostCommentsLayoutAll)).addView(reportedPostCommentView, 0);

    }
}