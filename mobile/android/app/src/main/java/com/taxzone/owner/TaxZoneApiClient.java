package com.taxzone.owner;

import android.net.Uri;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class TaxZoneApiClient {
    private final String baseUrl;
    private final String token;

    public TaxZoneApiClient(String baseUrl, String token) {
        this.baseUrl = trimTrailingSlash(baseUrl);
        this.token = token == null ? "" : token.trim();
    }

    public boolean isMockMode() {
        return baseUrl == null || baseUrl.trim().isEmpty() || "mock".equalsIgnoreCase(baseUrl.trim());
    }

    private String getMockResponse(String path) {
        if (path.startsWith("/api/v1/mobile/dashboard")) {
            return "{\"success\":true,\"data\":{" +
                   "\"title\":\"Welcome back, James\"," +
                   "\"summary\":\"You have 3 high-priority compliance actions.\"," +
                   "\"pendingDocuments\":\"3\"," +
                   "\"filingProgress\":\"72%\"," +
                   "\"actions\":[" +
                     "{\"id\":\"act_123\",\"title\":\"Upload bank statement\",\"description\":\"Required for GST reconciliation.\",\"dueLabel\":\"Due 20 Jun\"}," +
                     "{\"id\":\"act_124\",\"title\":\"PAN Mismatch Review\",\"description\":\"PAN verification failed due to spelling difference.\",\"dueLabel\":\"Due 22 Jun\"}," +
                     "{\"id\":\"act_125\",\"title\":\"GST Invoices Signature\",\"description\":\"Please sign the generated tax summary for filing.\",\"dueLabel\":\"Due 25 Jun\"}" +
                   "]," +
                   "\"consultant\":{" +
                     "\"name\":\"Sarah Harrington\"," +
                     "\"role\":\"Tax Compliance Advisor\"," +
                     "\"lastUpdate\":\"Purchase invoice mismatch found.\"" +
                   "}" +
                   "}}";
        } else if (path.startsWith("/api/v1/mobile/documents")) {
            return "{\"success\":true,\"data\":{" +
                   "\"documents\":[" +
                     "{\"id\":\"doc_123\",\"name\":\"Bank Statement Jul 2025\",\"status\":\"Pending upload\",\"description\":\"Required for document verification.\"}," +
                     "{\"id\":\"doc_124\",\"name\":\"PAN Card Copy\",\"status\":\"Approved\",\"description\":\"Used for identity verification.\"}," +
                     "{\"id\":\"doc_125\",\"name\":\"GST Sales Register Q1\",\"status\":\"Rejected\",\"description\":\"Rejection reason: Missing purchase invoice items.\"} " +
                   "]" +
                   "}}";
        } else if (path.startsWith("/api/v1/mobile/filings")) {
            return "{\"success\":true,\"data\":{" +
                   "\"heading\":\"GST Monthly Filing\"," +
                   "\"description\":\"FY 2025-26 · July\"," +
                   "\"stages\":[" +
                     "{\"title\":\"Documents uploaded\",\"status\":\"Complete\",\"complete\":true}," +
                     "{\"title\":\"Documents verified\",\"status\":\"Complete\",\"complete\":true}," +
                     "{\"title\":\"Under Review\",\"status\":\"In Progress\",\"complete\":false}," +
                     "{\"title\":\"Filing Submission\",\"status\":\"Pending\",\"complete\":false}" +
                   "]" +
                   "}}";
        } else if (path.startsWith("/api/v1/mobile/notifications")) {
            return "{\"success\":true,\"data\":{" +
                   "\"notifications\":[" +
                     "{\"id\":\"note_123\",\"title\":\"Document rejected\",\"body\":\"Please upload a corrected purchase invoice.\",\"createdAt\":\"2026-06-06T08:30:00Z\"}," +
                     "{\"id\":\"note_124\",\"title\":\"Filing Started\",\"body\":\"Your GST return filing has been initialized by Sarah.\",\"createdAt\":\"2026-06-05T14:22:00Z\"}" +
                   "]" +
                   "}}";
        } else if (path.startsWith("/api/v1/mobile/profile")) {
            return "{\"success\":true,\"data\":{" +
                   "\"name\":\"Aravind Sharma\"," +
                   "\"organization\":\"TaxZone client\"," +
                   "\"verificationSummary\":\"Email verified\\nPhone verified\\nPAN verified\"," +
                   "\"businessSummary\":\"PAN: ABCPS1234F\\nGSTIN: 27ABCPS1234F1Z5\"" +
                   "}}";
        }
        return "{\"success\":true}";
    }

    public JSONObject get(String path) throws Exception {
        if (isMockMode()) {
            return new JSONObject(getMockResponse(path));
        }
        HttpURLConnection connection = open(path, "GET");
        return readJson(connection);
    }

    public JSONObject post(String path, JSONObject payload) throws Exception {
        if (isMockMode()) {
            return new JSONObject(getMockResponse(path));
        }
        HttpURLConnection connection = open(path, "POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        byte[] body = payload.toString().getBytes(StandardCharsets.UTF_8);
        connection.setFixedLengthStreamingMode(body.length);
        try (DataOutputStream output = new DataOutputStream(connection.getOutputStream())) {
            output.write(body);
        }
        return readJson(connection);
    }

    public JSONObject requestUpload(String documentId, Uri uri, String fileName) throws Exception {
        JSONObject payload = new JSONObject();
        payload.put("documentId", documentId);
        payload.put("fileName", fileName);
        payload.put("contentUri", uri.toString());
        return post("/api/v1/mobile/documents/" + documentId + "/upload-intent", payload);
    }

    private HttpURLConnection open(String path, String method) throws Exception {
        if (baseUrl.isEmpty()) {
            throw new IllegalStateException("API base URL is not configured");
        }
        URL url = new URL(baseUrl + path);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod(method);
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(20000);
        connection.setRequestProperty("Accept", "application/json");
        if (!token.isEmpty()) {
            connection.setRequestProperty("Authorization", "Bearer " + token);
        }
        return connection;
    }

    private JSONObject readJson(HttpURLConnection connection) throws Exception {
        int code = connection.getResponseCode();
        InputStream stream = code >= 200 && code < 300 ? connection.getInputStream() : connection.getErrorStream();
        String text = readAll(stream);
        if (code < 200 || code >= 300) {
            throw new IllegalStateException("API " + code + ": " + text);
        }
        if (text == null || text.trim().isEmpty()) {
            return new JSONObject();
        }
        return new JSONObject(text);
    }

    private String readAll(InputStream stream) throws Exception {
        if (stream == null) {
            return "";
        }
        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }

    public static JSONArray dataArray(JSONObject response, String key) {
        JSONObject data = response.optJSONObject("data");
        if (data == null) {
            return new JSONArray();
        }
        return data.optJSONArray(key) == null ? new JSONArray() : data.optJSONArray(key);
    }

    public static JSONObject dataObject(JSONObject response) {
        JSONObject data = response.optJSONObject("data");
        return data == null ? new JSONObject() : data;
    }

    private String trimTrailingSlash(String value) {
        if (value == null) {
            return "";
        }
        String trimmed = value.trim();
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }
}

