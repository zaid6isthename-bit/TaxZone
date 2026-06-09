package com.taxzone.owner;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.view.Gravity;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private static final int PICK_DOCUMENT = 9001;
    private final int blue = Color.rgb(67, 56, 202);
    private final int dark = Color.rgb(9, 11, 20);
    private final int card = Color.rgb(255, 255, 255);
    private final int page = Color.rgb(245, 247, 251);
    private final int ink = Color.rgb(17, 24, 39);
    private final int muted = Color.rgb(101, 116, 139);
    private final int danger = Color.rgb(220, 38, 38);
    private String screen = "Dashboard";
    private SharedPreferences prefs;
    private JSONObject state = new JSONObject();
    private String pendingUploadDocumentId;
    private boolean notificationsSubscribed = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences("taxzone", MODE_PRIVATE);
        String existingToken = prefs.getString("authToken", "");
        if (!existingToken.isEmpty()) {
            subscribeToRealtimeNotifications(existingToken);
        }
        renderLoading("Connecting to TaxZone");
        loadScreen("Dashboard");
    }

    private void subscribeToRealtimeNotifications(String token) {
        if (notificationsSubscribed || token == null || token.isEmpty()) return;
        try {
            String payload = new String(android.util.Base64.decode(token.split("\\.")[1], android.util.Base64.URL_SAFE));
            JSONObject claims = new JSONObject(payload);
            String userId = claims.optString("sub");
            if (userId.isEmpty()) return;

            SupabaseModule.INSTANCE.subscribeToNotifications(userId, data -> {
                runOnUiThread(() -> {
                    int current = prefs.getInt("unreadBadge", 0);
                    prefs.edit().putInt("unreadBadge", current + 1).apply();
                    Toast.makeText(this, "New notification received", Toast.LENGTH_SHORT).show();
                    if ("Alerts".equals(screen)) loadScreen(screen);
                });
            });
            notificationsSubscribed = true;
        } catch (Exception ignored) {}
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_DOCUMENT && resultCode == RESULT_OK && data != null && pendingUploadDocumentId != null) {
            Uri uri = data.getData();
            String fileName = fileName(uri);
            runApiAction("Preparing secure upload", () -> api().requestUpload(pendingUploadDocumentId, uri, fileName));
        }
    }

    private void loadScreen(String nextScreen) {
        screen = nextScreen;
        renderLoading("Loading " + nextScreen);
        new Thread(() -> {
            try {
                JSONObject result;
                if ("Dashboard".equals(screen)) {
                    result = api().get("/api/v1/mobile/dashboard");
                } else if ("Documents".equals(screen)) {
                    result = api().get("/api/v1/mobile/documents");
                } else if ("Filings".equals(screen)) {
                    result = api().get("/api/v1/mobile/filings");
                } else if ("Alerts".equals(screen)) {
                    result = api().get("/api/v1/mobile/notifications");
                } else {
                    result = api().get("/api/v1/mobile/profile");
                }
                state = result;
                runOnUiThread(this::render);
            } catch (Exception error) {
                runOnUiThread(() -> renderError(error.getMessage()));
            }
        }).start();
    }

    private TaxZoneApiClient api() {
        return new TaxZoneApiClient(prefs.getString("apiBaseUrl", ""), prefs.getString("authToken", ""));
    }

    private void render() {
        ScrollView scroll = baseScroll();
        LinearLayout root = root(scroll);
        root.addView(header());
        root.addView(nav());
        if ("Dashboard".equals(screen)) {
            dashboard(root);
        } else if ("Documents".equals(screen)) {
            documents(root);
        } else if ("Filings".equals(screen)) {
            filings(root);
        } else if ("Alerts".equals(screen)) {
            alerts(root);
        } else {
            profile(root);
        }
        fade(scroll);
        setContentView(scroll);
    }

    private void dashboard(LinearLayout root) {
        JSONObject data = TaxZoneApiClient.dataObject(state);
        root.addView(hero(data.optString("title", "TaxZone Dashboard"), data.optString("summary", "Live client workspace")));
        LinearLayout stats = row();
        stats.addView(metric(data.optString("pendingDocuments", "0"), "Pending"), weight());
        stats.addView(metric(data.optString("filingProgress", "0%"), "Progress"), weightLeft());
        root.addView(stats);
        root.addView(section("Priority Actions"));
        addCards(root, data.optJSONArray("actions"), "title", "description", "dueLabel", "Open", payload -> runApiAction("Opening action", () -> api().post("/api/v1/mobile/actions/" + payload.optString("id") + "/open", new JSONObject())));
        root.addView(section("Assigned Expert"));
        JSONObject expert = data.optJSONObject("consultant");
        if (expert == null) {
            root.addView(empty("No consultant assigned yet."));
        } else {
            root.addView(info(expert.optString("name"), expert.optString("role") + "\n" + expert.optString("lastUpdate")));
        }
    }

    private void documents(LinearLayout root) {
        JSONObject data = TaxZoneApiClient.dataObject(state);
        root.addView(hero("Document Center", "Upload, verify, and track secure compliance documents."));
        addCards(root, data.optJSONArray("documents"), "name", "status", "description", "Upload", payload -> {
            pendingUploadDocumentId = payload.optString("id");
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("*/*");
            startActivityForResult(intent, PICK_DOCUMENT);
        });
    }

    private void filings(LinearLayout root) {
        JSONObject data = TaxZoneApiClient.dataObject(state);
        root.addView(hero(data.optString("heading", "Filing Timeline"), data.optString("description", "Live filing progress from TaxZone workflow engine.")));
        JSONArray stages = data.optJSONArray("stages");
        if (stages == null || stages.length() == 0) {
            root.addView(empty("No filing stages returned by the API."));
            return;
        }
        for (int i = 0; i < stages.length(); i++) {
            JSONObject stage = stages.optJSONObject(i);
            root.addView(timeline(stage.optString("title"), stage.optString("status"), stage.optBoolean("complete")));
        }
    }

    private void alerts(LinearLayout root) {
        JSONObject data = TaxZoneApiClient.dataObject(state);
        root.addView(hero("Notifications", "Event-driven reminders and workflow updates."));
        addCards(root, data.optJSONArray("notifications"), "title", "body", "createdAt", "Mark read", payload -> runApiAction("Marking notification read", () -> api().post("/api/v1/mobile/notifications/" + payload.optString("id") + "/read", new JSONObject())));
    }

    private void profile(LinearLayout root) {
        JSONObject data = TaxZoneApiClient.dataObject(state);
        root.addView(hero(data.optString("name", "Client Profile"), data.optString("organization", "TaxZone client")));
        root.addView(info("Verification", data.optString("verificationSummary", "No verification data returned.")));
        root.addView(info("Business Details", data.optString("businessSummary", "No business data returned.")));
        root.addView(section("Owner Configuration"));
        root.addView(configForm());
    }

    private void addCards(LinearLayout root, JSONArray items, String titleKey, String statusKey, String detailKey, String buttonLabel, CardAction action) {
        if (items == null || items.length() == 0) {
            root.addView(empty("No records returned by the API."));
            return;
        }
        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.optJSONObject(i);
            root.addView(actionCard(item.optString(titleKey), item.optString(statusKey), item.optString(detailKey), buttonLabel, v -> {
                try {
                    action.run(item);
                } catch (Exception error) {
                    renderError(error.getMessage());
                }
            }));
        }
    }

    private LinearLayout configForm() {
        LinearLayout box = panel();
        box.setPadding(dp(14), dp(14), dp(14), dp(14));
        EditText baseUrl = input("API base URL", prefs.getString("apiBaseUrl", ""));
        EditText token = input("Bearer token", prefs.getString("authToken", ""));
        box.addView(baseUrl);
        box.addView(token);
        Button save = button("Save and refresh");
        save.setOnClickListener(v -> {
            prefs.edit().putString("apiBaseUrl", baseUrl.getText().toString()).putString("authToken", token.getText().toString()).apply();
            notificationsSubscribed = false;
            subscribeToRealtimeNotifications(token.getText().toString());
            loadScreen("Dashboard");
        });
        box.addView(save);
        return margin(box);
    }

    private void runApiAction(String label, ApiOperation operation) {
        renderLoading(label);
        new Thread(() -> {
            try {
                operation.run();
                runOnUiThread(() -> {
                    Toast.makeText(this, "Action completed", Toast.LENGTH_SHORT).show();
                    loadScreen(screen);
                });
            } catch (Exception error) {
                runOnUiThread(() -> renderError(error.getMessage()));
            }
        }).start();
    }

    private void renderLoading(String message) {
        ScrollView scroll = baseScroll();
        LinearLayout root = root(scroll);
        root.setGravity(Gravity.CENTER);
        ProgressBar bar = new ProgressBar(this);
        root.addView(bar);
        TextView label = text(message, 16, ink, Typeface.BOLD);
        label.setPadding(0, dp(14), 0, 0);
        root.addView(label);
        setContentView(scroll);
    }

    private void renderError(String message) {
        ScrollView scroll = baseScroll();
        LinearLayout root = root(scroll);
        root.addView(header());
        root.addView(nav());
        root.addView(hero("Connection required", "TaxZone is ready for live data. Configure the production API to load records."));
        root.addView(info("API Error", message == null ? "Unknown error" : message));
        root.addView(configForm());
        setContentView(scroll);
    }

    private LinearLayout header() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        TextView brand = text("TaxZone Enterprise SaaS Platform", 16, Color.WHITE, Typeface.BOLD);
        brand.setPadding(dp(14), dp(12), dp(14), dp(12));
        brand.setBackgroundColor(dark);
        box.addView(brand);
        return box;
    }

    private LinearLayout nav() {
        LinearLayout row = row();
        row.setPadding(0, dp(14), 0, dp(10));
        String[] tabs = {"Dashboard", "Documents", "Filings", "Alerts", "Profile"};
        for (String tab : tabs) {
            TextView item = text(tab.substring(0, Math.min(4, tab.length())), 12, tab.equals(screen) ? Color.WHITE : blue, Typeface.BOLD);
            item.setGravity(Gravity.CENTER);
            item.setPadding(dp(7), dp(10), dp(7), dp(10));
            item.setBackgroundColor(tab.equals(screen) ? blue : Color.rgb(231, 235, 255));
            item.setOnClickListener(v -> loadScreen(tab));
            row.addView(item, weightLeftSmall());
        }
        return row;
    }

    private LinearLayout hero(String title, String detail) {
        LinearLayout box = panel();
        box.setPadding(dp(16), dp(16), dp(16), dp(16));
        box.addView(text(title, 23, ink, Typeface.BOLD));
        TextView copy = text(detail, 14, muted, Typeface.NORMAL);
        copy.setPadding(0, dp(8), 0, 0);
        copy.setLineSpacing(3, 1.05f);
        box.addView(copy);
        return margin(box);
    }

    private LinearLayout metric(String value, String label) {
        LinearLayout box = panel();
        box.setPadding(dp(14), dp(14), dp(14), dp(14));
        box.addView(text(value, 26, blue, Typeface.BOLD));
        box.addView(text(label, 13, muted, Typeface.NORMAL));
        return box;
    }

    private LinearLayout actionCard(String title, String status, String detail, String label, View.OnClickListener listener) {
        LinearLayout box = panel();
        box.setPadding(dp(14), dp(13), dp(14), dp(13));
        box.addView(text(title, 16, ink, Typeface.BOLD));
        box.addView(text(status, 13, status.toLowerCase().contains("reject") ? danger : blue, Typeface.BOLD));
        TextView body = text(detail, 14, muted, Typeface.NORMAL);
        body.setPadding(0, dp(7), 0, dp(9));
        body.setLineSpacing(3, 1.05f);
        box.addView(body);
        Button action = button(label);
        action.setOnClickListener(listener);
        box.addView(action);
        return margin(box);
    }

    private LinearLayout info(String title, String body) {
        LinearLayout box = panel();
        box.setPadding(dp(14), dp(13), dp(14), dp(13));
        box.addView(text(title, 16, ink, Typeface.BOLD));
        TextView copy = text(body, 14, muted, Typeface.NORMAL);
        copy.setPadding(0, dp(7), 0, 0);
        copy.setLineSpacing(3, 1.05f);
        box.addView(copy);
        return margin(box);
    }

    private LinearLayout timeline(String title, String status, boolean complete) {
        LinearLayout row = panel();
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(dp(12), dp(12), dp(12), dp(12));
        row.addView(text(complete ? "✓" : "•", 22, complete ? blue : muted, Typeface.BOLD));
        row.addView(text("  " + title, 15, ink, Typeface.BOLD), weight());
        row.addView(text(status, 13, complete ? blue : muted, Typeface.BOLD));
        return margin(row);
    }

    private TextView section(String label) {
        TextView view = text(label, 18, ink, Typeface.BOLD);
        view.setPadding(0, dp(14), 0, dp(9));
        return view;
    }

    private LinearLayout empty(String label) {
        return info("Empty state", label);
    }

    private EditText input(String hint, String value) {
        EditText input = new EditText(this);
        input.setHint(hint);
        input.setText(value);
        input.setSingleLine(true);
        input.setTextSize(14);
        input.setPadding(dp(10), dp(8), dp(10), dp(8));
        return input;
    }

    private Button button(String label) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextSize(13);
        button.setTextColor(Color.WHITE);
        button.setAllCaps(false);
        button.setBackgroundColor(blue);
        return button;
    }

    private ScrollView baseScroll() {
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(page);
        return scroll;
    }

    private LinearLayout root(ScrollView scroll) {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(18), dp(16), dp(28));
        scroll.addView(root);
        return root;
    }

    private LinearLayout panel() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(card);
        return layout;
    }

    private LinearLayout row() {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        return row;
    }

    private LinearLayout margin(LinearLayout view) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 0, dp(10));
        view.setLayoutParams(params);
        return view;
    }

    private TextView text(String value, int sp, int color, int style) {
        TextView view = new TextView(this);
        view.setText(value);
        view.setTextSize(sp);
        view.setTextColor(color);
        view.setTypeface(Typeface.DEFAULT, style);
        return view;
    }

    private LinearLayout.LayoutParams weight() {
        return new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);
    }

    private LinearLayout.LayoutParams weightLeft() {
        LinearLayout.LayoutParams params = weight();
        params.setMargins(dp(10), 0, 0, 0);
        return params;
    }

    private LinearLayout.LayoutParams weightLeftSmall() {
        LinearLayout.LayoutParams params = weight();
        params.setMargins(dp(2), 0, dp(2), 0);
        return params;
    }

    private void fade(View view) {
        AlphaAnimation animation = new AlphaAnimation(0.88f, 1f);
        animation.setDuration(180);
        view.startAnimation(animation);
    }

    private String fileName(Uri uri) {
        try (android.database.Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (index >= 0) {
                    return cursor.getString(index);
                }
            }
        } catch (Exception ignored) {
        }
        return "document";
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private interface ApiOperation {
        JSONObject run() throws Exception;
    }

    private interface CardAction {
        void run(JSONObject payload) throws Exception;
    }
}
