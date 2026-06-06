package com.taxzone.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.taxzone.app.ui.theme.*

@Composable
fun WelcomeScreen(
    onNavigateToHome: () -> Unit,
    onNavigateToPortal: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize().statusBarsPadding(),
        color = Gray50
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(BrandPrimary, BrandIndigo)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "TZ",
                    color = Color.White,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "TaxZone",
                style = MaterialTheme.typography.displayMedium.copy(
                    fontWeight = FontWeight.ExtraBold,
                    color = Gray900
                )
            )
            Text(
                text = "Precision Ledger",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = Gray500,
                    letterSpacing = 1.sp
                ),
                modifier = Modifier.padding(bottom = 48.dp)
            )

            Button(
                onClick = onNavigateToHome,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .padding(bottom = 16.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = BrandPrimary,
                    contentColor = Color.White
                )
            ) {
                Text("Client Login", style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
            }

            OutlinedButton(
                onClick = onNavigateToPortal,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.5.dp, BrandPrimary),
                colors = ButtonDefaults.outlinedButtonColors(
                    contentColor = BrandPrimary
                )
            ) {
                Text("Business Portal", style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
            }
        }
    }
}
