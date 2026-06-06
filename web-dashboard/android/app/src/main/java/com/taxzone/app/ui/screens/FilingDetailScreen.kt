package com.taxzone.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taxzone.app.ui.theme.*

data class FilingDetail(
    val type: String,
    val period: String,
    val dueDate: String,
    val status: String,
    val progress: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FilingDetailScreen(onBack: () -> Unit) {
    val filings = listOf(
        FilingDetail("GSTR-1", "October 2024", "31 Oct 2024", "Under Review", 60),
        FilingDetail("GSTR-3B", "October 2024", "20 Nov 2024", "Not Started", 0),
        FilingDetail("ITR-1", "FY 2024-25", "31 Jul 2025", "In Progress", 40),
        FilingDetail("GSTR-9", "Annual FY 2023-24", "31 Dec 2024", "Not Started", 0),
        FilingDetail("TDS Return", "Q2 FY 2024-25", "15 Oct 2024", "Completed", 100)
    )

    val filters = listOf("All", "In Progress", "Under Review", "Completed", "Not Started")
    var selectedFilter by remember { mutableStateOf("All") }
    var searchQuery by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            Surface(shadowElevation = 2.dp) {
                Column(
                    modifier = Modifier
                        .background(Color.White)
                        .statusBarsPadding()
                        .padding(bottom = 12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = onBack) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                        }
                        Text(
                            "My Filings",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Gray900)
                        )
                    }
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        placeholder = { Text("Search filings...", fontSize = 14.sp) },
                        leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null, modifier = Modifier.size(20.dp)) },
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Gray50,
                            unfocusedContainerColor = Gray50,
                            focusedBorderColor = BrandPrimary,
                            unfocusedBorderColor = Gray200
                        ),
                        singleLine = true
                    )
                }
            }
        },
        containerColor = Gray50
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(bottom = 20.dp)
        ) {
            // Category Filter
            item {
                LazyRow(
                    modifier = Modifier.padding(vertical = 12.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(filters) { f ->
                        FilterChip(
                            label = f,
                            selected = selectedFilter == f,
                            onClick = { selectedFilter = f }
                        )
                    }
                }
            }

            // Filings List
            items(filings.filter { it.status == selectedFilter || selectedFilter == "All" }) { filing ->
                FilingItem(filing)
            }
        }
    }
}

@Composable
fun FilingItem(filing: FilingDetail) {
    Card(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .fillMaxWidth()
            .clickable { },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(BrandPrimaryLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Rounded.Description, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Surface(
                            color = BrandPrimaryLight,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                filing.type,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = BrandPrimary, fontSize = 10.sp)
                            )
                        }
                        Text(filing.period, style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold, color = Gray900))
                    }
                }
                StatusBadge(status = filing.status)
            }

            if (filing.progress > 0) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Progress", style = MaterialTheme.typography.labelSmall.copy(color = Gray500))
                    Text("${filing.progress}%", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = BrandPrimary))
                }
                Spacer(modifier = Modifier.height(4.dp))
                LinearProgressIndicator(
                    progress = { filing.progress / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(CircleShape),
                    color = BrandPrimary,
                    trackColor = Gray200
                )
            }

            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Rounded.CalendarToday, contentDescription = null, tint = Gray500, modifier = Modifier.size(13.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Due ${filing.dueDate}", style = MaterialTheme.typography.labelSmall.copy(color = Gray500))
                }
                Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = Gray400, modifier = Modifier.size(18.dp))
            }
        }
    }
}
