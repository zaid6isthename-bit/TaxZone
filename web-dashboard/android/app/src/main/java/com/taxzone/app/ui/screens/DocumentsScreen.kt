package com.taxzone.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DocumentsScreen(onBack: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Documents") },
                navigationIcon = {
                    Button(onClick = onBack, modifier = Modifier.padding(8.dp)) {
                        Text("Back")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp)
        ) {
            item {
                Text("Your Documents", style = MaterialTheme.typography.headlineLarge)
                Spacer(modifier = Modifier.height(16.dp))
                // Placeholder list
                for (i in 1..5) {
                    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                        Text("Document $i.pdf", modifier = Modifier.padding(16.dp))
                    }
                }
            }
        }
    }
}
