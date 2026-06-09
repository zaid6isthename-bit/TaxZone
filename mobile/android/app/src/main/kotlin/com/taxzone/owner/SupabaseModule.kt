package com.taxzone.owner

import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.realtime.channel
import io.github.jan.supabase.realtime.postgresChangeFlow
import io.github.jan.supabase.storage.Storage
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

object SupabaseModule {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val client by lazy {
        createSupabaseClient(
            supabaseUrl = BuildConfig.SUPABASE_URL,
            supabaseKey = BuildConfig.SUPABASE_ANON_KEY,
        ) {
            install(Auth)
            install(Storage)
            install(Realtime)
        }
    }

    fun getStorage() = client.storage

    fun subscribeToNotifications(userId: String, onData: (String) -> Unit) {
        scope.launch {
            val channel = client.channel("notifications-$userId")
            val flow = channel.postgresChangeFlow<Any>(schema = "public") {
                table = "notifications"
                filter = "recipient_id=eq.$userId"
            }
            channel.subscribe()
            flow.collectLatest { change ->
                onData(change.toString())
            }
        }
    }

    fun createSignedUploadUrl(
        bucket: String = "taxzone-documents",
        path: String,
        onResult: (String?) -> Unit,
    ) {
        scope.launch {
            try {
                val result = client.storage[bucket].createSignedUploadUrl(path)
                onResult(result.url)
            } catch (e: Exception) {
                onResult(null)
            }
        }
    }
}
