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
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taxzone.app.ui.theme.*

data class Document(
    val name: String,
    val type: String,
    val size: String,
    val date: String,
    val category: String,
    val status: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DocumentsScreen(onBack: () -> Unit) {
    val documents = listOf(
        Document("PAN Card Copy.pdf", "PDF", "2.4 MB", "10 May 2023", "Identity", "Verified"),
        Document("Form 16 FY 2023-24.pdf", "PDF", "1.1 MB", "15 Jun 2024", "Income", "Verified"),
        Document("Bank Statement Apr 2024.pdf", "PDF", "3.8 MB", "5 May 2024", "Financial", "Pending"),
        Document("Aadhar Card.jpg", "IMG", "856 KB", "10 May 2023", "Identity", "Verified"),
        Document("Rent Agreement 2023.pdf", "PDF", "4.2 MB", "1 Apr 2023", "Legal", "Not Required")
    )

    val categories = listOf("All", "Identity", "Income", "Financial", "Legal")
    var selectedCategory by remember { mutableStateOf("All") }
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
                            "Documents",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold, color = Gray900)
                        )
                    }
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        placeholder = { Text("Search documents...", fontSize = 14.sp) },
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
            // Upload Area
            item {
                UploadArea()
            }

            // Category Filter
            item {
                LazyRow(
                    modifier = Modifier.padding(vertical = 12.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(categories) { cat ->
                        FilterChip(
                            label = cat,
                            selected = selectedCategory == cat,
                            onClick = { selectedCategory = cat }
                        )
                    }
                }
            }

            // Document List
            items(documents.filter { it.category == selectedCategory || selectedCategory == "All" }) { doc ->
                DocumentItem(doc)
            }
        }
    }
}

@Composable
fun UploadArea() {
    val stroke = Stroke(width = 2f, pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f))
    Box(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .height(140.dp)
            .drawBehind {
                drawRoundRect(
                    color = BrandPrimary.copy(alpha = 0.3f),
                    style = stroke,
                    cornerRadius = CornerRadius(12.dp.toPx())
                )
            }
            .clip(RoundedCornerShape(12.dp))
            .background(BrandPrimaryLight.copy(alpha = 0.3f))
            .clickable { }
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(BrandPrimaryLight),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Rounded.CloudUpload, contentDescription = null, tint = BrandPrimary, modifier = Modifier.size(24.dp))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text("Upload Document", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Gray900))
            Text("PDF, JPG, PNG up to 10MB", style = MaterialTheme.typography.labelSmall.copy(color = Gray500))
        }
    }
}

@Composable
fun FilterChip(label: String, selected: Boolean, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.clickable { onClick() },
        color = if (selected) BrandPrimary else Color.White,
        shape = RoundedCornerShape(20.dp),
        border = if (selected) null else androidx.compose.foundation.BorderStroke(1.dp, Gray200)
    ) {
        Text(
            label,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            style = MaterialTheme.typography.labelMedium.copy(
                fontWeight = FontWeight.Medium,
                color = if (selected) Color.White else Gray700,
                fontSize = 12.sp
            )
        )
    }
}

@Composable
fun DocumentItem(doc: Document) {
    Card(
        modifier = Modifier
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Gray100),
                contentAlignment = Alignment.Center
            ) {
                val icon = when (doc.type) {
                    "PDF" -> Icons.Rounded.Description
                    "IMG" -> Icons.Rounded.Image
                    else -> Icons.Rounded.InsertDriveFile
                }
                val iconColor = when (doc.type) {
                    "PDF" -> Color(0xFFEF4444)
                    "IMG" -> Color(0xFFA855F7)
                    else -> Gray500
                }
                Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(doc.name, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Gray900))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(doc.size, style = MaterialTheme.typography.labelSmall.copy(color = Gray500, fontSize = 11.sp))
                    Box(modifier = Modifier.padding(horizontal = 6.dp).size(3.dp).clip(CircleShape).background(Gray200))
                    Text(doc.date, style = MaterialTheme.typography.labelSmall.copy(color = Gray500, fontSize = 11.sp))
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                StatusBadge(status = doc.status)
                Spacer(modifier = Modifier.height(4.dp))
                IconButton(onClick = { }, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Rounded.Download, contentDescription = "Download", tint = Gray400, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}
