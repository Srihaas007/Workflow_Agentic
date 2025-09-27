"""
AI-powered email and notification automation engine.

This module provides intelligent email content generation, recipient optimization,
and engagement tracking inspired by your chatbot communication patterns.
"""

import asyncio
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import logging
import re

logger = logging.getLogger(__name__)

class EmailAI:
    """AI engine for email automation and content generation"""
    
    def __init__(self):
        """Initialize the email AI engine"""
        self.content_templates = self._load_content_templates()
        self.engagement_history = []
        self.personalization_data = {}
        
    def _load_content_templates(self) -> Dict[str, Any]:
        """Load email content templates (inspired by your response patterns)"""
        return {
            "professional": {
                "greetings": [
                    "Dear {recipient_name},",
                    "Hello {recipient_name},",
                    "Good {time_of_day} {recipient_name},"
                ],
                "closings": [
                    "Best regards,",
                    "Sincerely,",
                    "Thank you for your time,"
                ],
                "tone_keywords": ["please", "thank you", "kindly", "appreciate"]
            },
            "friendly": {
                "greetings": [
                    "Hi {recipient_name}!",
                    "Hey {recipient_name},",
                    "Hope you're doing well, {recipient_name}!"
                ],
                "closings": [
                    "Thanks!",
                    "Cheers,",
                    "Looking forward to hearing from you!"
                ],
                "tone_keywords": ["awesome", "great", "excited", "looking forward"]
            },
            "urgent": {
                "greetings": [
                    "Hi {recipient_name},",
                    "URGENT: {recipient_name},"
                ],
                "closings": [
                    "Please respond ASAP,",
                    "Time-sensitive - please respond quickly,"
                ],
                "tone_keywords": ["urgent", "immediately", "ASAP", "time-sensitive"]
            }
        }
    
    async def generate_content(
        self, 
        purpose: str, 
        context: Dict[str, Any], 
        tone: str = "professional",
        recipients: List[str] = None
    ) -> Dict[str, Any]:
        """
        Generate AI-powered email content based on purpose and context.
        
        This method uses patterns similar to your chatbot's response generation
        to create contextually appropriate email content.
        """
        try:
            # Analyze the purpose and context
            content_analysis = self._analyze_content_requirements(purpose, context, tone)
            
            # Generate personalized content for each recipient
            if recipients:
                personalized_content = []
                for recipient in recipients:
                    personal_content = await self._generate_personalized_content(
                        content_analysis, recipient, context
                    )
                    personalized_content.append(personal_content)
            else:
                personalized_content = [await self._generate_generic_content(content_analysis, context)]
            
            # Generate subject line suggestions
            subject_suggestions = self._generate_subject_lines(purpose, context, tone)
            
            # Analyze optimal send time
            send_time_analysis = self._analyze_optimal_send_time(recipients or [], context)
            
            result = {
                "purpose": purpose,
                "tone": tone,
                "generated_at": datetime.utcnow().isoformat(),
                "content": personalized_content,
                "subject_suggestions": subject_suggestions,
                "send_time_analysis": send_time_analysis,
                "estimated_engagement": self._predict_engagement(content_analysis, tone),
                "content_score": content_analysis.get("quality_score", 0)
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Email content generation failed: {e}")
            return {"error": str(e), "content": []}
    
    def _analyze_content_requirements(self, purpose: str, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        """Analyze content requirements (inspired by your intent recognition patterns)"""
        
        # Analyze purpose keywords (similar to your voice command matching)
        purpose_analysis = {
            "intent": self._classify_intent(purpose),
            "urgency": self._detect_urgency(purpose, context),
            "call_to_action": self._identify_call_to_action(purpose),
            "tone_adjustment": self._suggest_tone_adjustment(purpose, tone)
        }
        
        # Context analysis
        context_factors = {
            "recipient_count": len(context.get("recipients", [])),
            "has_deadline": "deadline" in context or "due" in str(context).lower(),
            "includes_data": "data" in context or "report" in context,
            "follow_up": "follow" in purpose.lower() or "reminder" in purpose.lower()
        }
        
        # Calculate content quality score
        quality_score = self._calculate_content_quality_score(purpose_analysis, context_factors)
        
        return {
            "purpose_analysis": purpose_analysis,
            "context_factors": context_factors,
            "quality_score": quality_score,
            "recommended_length": self._suggest_content_length(purpose_analysis),
            "key_elements": self._identify_key_elements(purpose, context)
        }
    
    def _classify_intent(self, purpose: str) -> str:
        """Classify email intent (inspired by your chatbot intent classification)"""
        purpose_lower = purpose.lower()
        
        if any(word in purpose_lower for word in ["meeting", "schedule", "call", "appointment"]):
            return "scheduling"
        elif any(word in purpose_lower for word in ["update", "status", "progress", "report"]):
            return "update"
        elif any(word in purpose_lower for word in ["request", "need", "require", "ask"]):
            return "request"
        elif any(word in purpose_lower for word in ["follow", "reminder", "check"]):
            return "follow_up"
        elif any(word in purpose_lower for word in ["thank", "appreciate", "gratitude"]):
            return "appreciation"
        elif any(word in purpose_lower for word in ["invite", "invitation", "join"]):
            return "invitation"
        else:
            return "general"
    
    def _detect_urgency(self, purpose: str, context: Dict[str, Any]) -> str:
        """Detect urgency level"""
        urgent_keywords = ["urgent", "asap", "immediately", "emergency", "critical"]
        
        if any(keyword in purpose.lower() for keyword in urgent_keywords):
            return "high"
        elif context.get("deadline") or "tomorrow" in purpose.lower():
            return "medium"
        else:
            return "low"
    
    def _identify_call_to_action(self, purpose: str) -> str:
        """Identify the main call to action"""
        purpose_lower = purpose.lower()
        
        if "reply" in purpose_lower or "respond" in purpose_lower:
            return "respond"
        elif "schedule" in purpose_lower or "meeting" in purpose_lower:
            return "schedule_meeting"
        elif "review" in purpose_lower or "feedback" in purpose_lower:
            return "provide_feedback"
        elif "confirm" in purpose_lower or "confirmation" in purpose_lower:
            return "confirm"
        elif "join" in purpose_lower or "participate" in purpose_lower:
            return "participate"
        else:
            return "acknowledge"
    
    async def _generate_personalized_content(
        self, 
        analysis: Dict[str, Any], 
        recipient: str, 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate personalized content for a specific recipient"""
        
        # Extract recipient name (basic email parsing)
        recipient_name = self._extract_name_from_email(recipient)
        
        # Get personalization data if available
        personalization = self.personalization_data.get(recipient, {})
        
        # Select appropriate templates
        tone = analysis.get("purpose_analysis", {}).get("tone_adjustment", "professional")
        templates = self.content_templates.get(tone, self.content_templates["professional"])
        
        # Generate greeting
        greeting_template = templates["greetings"][0]  # Use first template for simplicity
        greeting = greeting_template.format(
            recipient_name=recipient_name,
            time_of_day=self._get_time_of_day()
        )
        
        # Generate main content
        main_content = await self._generate_main_content(analysis, context, personalization)
        
        # Generate closing
        closing = templates["closings"][0]
        
        # Assemble full content
        full_content = f"{greeting}\n\n{main_content}\n\n{closing}"
        
        return {
            "recipient": recipient,
            "recipient_name": recipient_name,
            "personalized": bool(personalization),
            "content": full_content,
            "word_count": len(full_content.split()),
            "estimated_read_time": f"{max(1, len(full_content.split()) // 200)} min"
        }
    
    async def _generate_generic_content(self, analysis: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate generic content when no specific recipients"""
        
        tone = analysis.get("purpose_analysis", {}).get("tone_adjustment", "professional")
        templates = self.content_templates.get(tone, self.content_templates["professional"])
        
        greeting = "Hello,"
        main_content = await self._generate_main_content(analysis, context, {})
        closing = templates["closings"][0]
        
        full_content = f"{greeting}\n\n{main_content}\n\n{closing}"
        
        return {
            "recipient": "generic",
            "personalized": False,
            "content": full_content,
            "word_count": len(full_content.split()),
            "estimated_read_time": f"{max(1, len(full_content.split()) // 200)} min"
        }
    
    async def _generate_main_content(
        self, 
        analysis: Dict[str, Any], 
        context: Dict[str, Any], 
        personalization: Dict[str, Any]
    ) -> str:
        """Generate the main email content"""
        
        intent = analysis.get("purpose_analysis", {}).get("intent", "general")
        urgency = analysis.get("purpose_analysis", {}).get("urgency", "low")
        call_to_action = analysis.get("purpose_analysis", {}).get("call_to_action", "acknowledge")
        
        # Generate content based on intent (similar to your response generation)
        if intent == "scheduling":
            content = self._generate_scheduling_content(context, urgency)
        elif intent == "update":
            content = self._generate_update_content(context)
        elif intent == "request":
            content = self._generate_request_content(context, urgency)
        elif intent == "follow_up":
            content = self._generate_followup_content(context)
        elif intent == "appreciation":
            content = self._generate_appreciation_content(context)
        elif intent == "invitation":
            content = self._generate_invitation_content(context)
        else:
            content = self._generate_general_content(context)
        
        # Add call to action
        if call_to_action != "acknowledge":
            content += f"\n\n{self._generate_call_to_action(call_to_action, urgency)}"
        
        return content
    
    def _generate_scheduling_content(self, context: Dict[str, Any], urgency: str) -> str:
        """Generate scheduling-focused content"""
        urgency_prefix = "URGENT: " if urgency == "high" else ""
        
        return f"""{urgency_prefix}I would like to schedule a meeting to discuss {context.get('topic', 'important matters')}.

Please let me know your availability for the following time slots:
- {context.get('option1', 'Option 1: Tomorrow 2-3 PM')}
- {context.get('option2', 'Option 2: Day after tomorrow 10-11 AM')}
- {context.get('option3', 'Option 3: Any time that works for you')}

The meeting is expected to last approximately {context.get('duration', '30 minutes')}."""
    
    def _generate_update_content(self, context: Dict[str, Any]) -> str:
        """Generate update/status content"""
        return f"""I wanted to provide you with an update on {context.get('project', 'our current project')}.

Current Status:
- Progress: {context.get('progress', '75% complete')}
- Key Achievements: {context.get('achievements', 'Major milestones reached')}
- Next Steps: {context.get('next_steps', 'Finalizing remaining tasks')}

{context.get('additional_info', 'Please let me know if you have any questions or need additional details.')}"""
    
    def _generate_request_content(self, context: Dict[str, Any], urgency: str) -> str:
        """Generate request content"""
        urgency_note = " This is time-sensitive and your prompt response would be greatly appreciated." if urgency == "high" else ""
        
        return f"""I am writing to request {context.get('request_type', 'your assistance')}.

Details:
{context.get('details', 'Please find the relevant information attached or described below.')}

Required by: {context.get('deadline', 'At your earliest convenience')}

{context.get('additional_context', '')}{urgency_note}"""
    
    def _generate_followup_content(self, context: Dict[str, Any]) -> str:
        """Generate follow-up content"""
        return f"""I wanted to follow up on {context.get('subject', 'our previous conversation')}.

{context.get('followup_reason', 'I wanted to check if you had a chance to review the information I sent earlier.')}

Original context: {context.get('original_context', 'Please see my previous email for details.')}"""
    
    def _generate_appreciation_content(self, context: Dict[str, Any]) -> str:
        """Generate appreciation/thank you content"""
        return f"""I wanted to take a moment to thank you for {context.get('reason', 'your help and support')}.

{context.get('specific_thanks', 'Your assistance has been invaluable and greatly appreciated.')}

{context.get('impact', 'This has made a significant positive impact on our project.')}"""
    
    def _generate_invitation_content(self, context: Dict[str, Any]) -> str:
        """Generate invitation content"""
        return f"""You are cordially invited to {context.get('event', 'our upcoming event')}.

Event Details:
- Date: {context.get('date', 'TBD')}
- Time: {context.get('time', 'TBD')}
- Location: {context.get('location', 'TBD')}
- Duration: {context.get('duration', 'Approximately 2 hours')}

{context.get('description', 'This will be an excellent opportunity to connect and collaborate.')}"""
    
    def _generate_general_content(self, context: Dict[str, Any]) -> str:
        """Generate general purpose content"""
        return f"""I hope this email finds you well.

{context.get('main_message', 'I wanted to reach out regarding a matter that requires your attention.')}

{context.get('details', 'Please find the relevant details below or attached.')}

{context.get('closing_note', 'Thank you for your time and consideration.')}"""
    
    def _generate_call_to_action(self, action_type: str, urgency: str) -> str:
        """Generate call to action based on type and urgency"""
        urgency_modifier = "as soon as possible" if urgency == "high" else "when convenient"
        
        actions = {
            "respond": f"Please respond {urgency_modifier}.",
            "schedule_meeting": f"Please let me know your availability {urgency_modifier}.",
            "provide_feedback": f"I would appreciate your feedback {urgency_modifier}.",
            "confirm": f"Please confirm your attendance {urgency_modifier}.",
            "participate": f"Please let me know if you can participate {urgency_modifier}."
        }
        
        return actions.get(action_type, f"Please take action {urgency_modifier}.")
    
    def _generate_subject_lines(self, purpose: str, context: Dict[str, Any], tone: str) -> List[str]:
        """Generate multiple subject line suggestions"""
        subject_suggestions = []
        
        # Extract key topic
        topic = context.get('topic') or context.get('project') or context.get('subject') or 'Important Matter'
        
        # Generate variations based on tone and purpose
        if tone == "urgent":
            subject_suggestions.extend([
                f"URGENT: {purpose}",
                f"Time Sensitive: {topic}",
                f"Action Required: {purpose}"
            ])
        elif tone == "friendly":
            subject_suggestions.extend([
                f"Quick question about {topic}",
                f"Let's chat about {topic}",
                f"Regarding {topic} - need your input!"
            ])
        else:  # professional
            subject_suggestions.extend([
                f"Re: {topic}",
                f"{purpose} - {topic}",
                f"Update on {topic}"
            ])
        
        # Add generic alternatives
        subject_suggestions.extend([
            f"Following up on {topic}",
            f"Next steps for {topic}",
            f"Your input needed: {topic}"
        ])
        
        return subject_suggestions[:5]  # Return top 5 suggestions
    
    def _analyze_optimal_send_time(self, recipients: List[str], context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze optimal send time for maximum engagement"""
        
        # Default optimal times (this would use ML in production)
        optimal_times = {
            "weekday_morning": "9:00 AM - 11:00 AM",
            "weekday_afternoon": "2:00 PM - 4:00 PM", 
            "tuesday_thursday": "Best engagement days",
            "avoid": ["Monday mornings", "Friday afternoons", "Weekends"]
        }
        
        # Analyze context for timing hints
        urgency = context.get("urgency", "low")
        if urgency == "high":
            recommendation = "Send immediately"
        else:
            recommendation = "Tuesday or Thursday, 10:00 AM"
        
        return {
            "recommendation": recommendation,
            "optimal_windows": optimal_times,
            "reasoning": "Based on general email engagement patterns",
            "send_score": 85,  # Mock engagement score
            "estimated_open_rate": "68%"
        }
    
    def _predict_engagement(self, analysis: Dict[str, Any], tone: str) -> Dict[str, Any]:
        """Predict email engagement metrics"""
        
        # Mock prediction based on analysis (would use ML in production)
        base_score = 65
        
        # Adjust based on analysis factors
        if analysis.get("quality_score", 0) > 80:
            base_score += 10
        
        if tone == "friendly":
            base_score += 5
        elif tone == "urgent":
            base_score += 8
        
        urgency = analysis.get("purpose_analysis", {}).get("urgency", "low")
        if urgency == "high":
            base_score += 12
        
        return {
            "predicted_open_rate": f"{min(95, base_score + 10)}%",
            "predicted_click_rate": f"{min(45, base_score - 20)}%",
            "predicted_response_rate": f"{min(35, base_score - 30)}%",
            "engagement_score": min(100, base_score),
            "confidence": "Medium (based on patterns)"
        }
    
    async def get_improvement_suggestions(self, content: Dict[str, Any]) -> List[str]:
        """Get suggestions for improving email content"""
        suggestions = []
        
        if not content:
            return ["No content to analyze"]
        
        # Analyze content length
        content_text = content.get("content", [{}])[0].get("content", "")
        word_count = len(content_text.split())
        
        if word_count < 50:
            suggestions.append("Consider adding more detail to provide better context")
        elif word_count > 300:
            suggestions.append("Content might be too long - consider summarizing key points")
        
        # Check for call to action
        if not any(cta in content_text.lower() for cta in ["please", "kindly", "would you", "can you"]):
            suggestions.append("Add a clear call to action to improve response rate")
        
        # Check personalization
        if not any(personal in content_text for personal in ["{", "name", "you"]):
            suggestions.append("Add personalization elements to increase engagement")
        
        # Tone analysis
        if content_text.count("!") > 3:
            suggestions.append("Reduce exclamation marks for a more professional tone")
        
        if not suggestions:
            suggestions.append("Content looks good! Consider A/B testing subject lines")
        
        return suggestions
    
    # Helper methods
    def _extract_name_from_email(self, email: str) -> str:
        """Extract name from email address"""
        if "@" in email:
            local_part = email.split("@")[0]
            # Replace dots and underscores with spaces, capitalize
            name = local_part.replace(".", " ").replace("_", " ").title()
            return name
        return "there"
    
    def _get_time_of_day(self) -> str:
        """Get appropriate greeting based on time"""
        import datetime
        hour = datetime.datetime.now().hour
        
        if 5 <= hour < 12:
            return "morning"
        elif 12 <= hour < 17:
            return "afternoon"
        else:
            return "evening"
    
    def _calculate_content_quality_score(self, purpose_analysis: Dict, context_factors: Dict) -> int:
        """Calculate overall content quality score"""
        score = 60  # Base score
        
        # Add points for clarity
        if purpose_analysis.get("intent") != "general":
            score += 15
        
        # Add points for context
        if context_factors.get("has_deadline"):
            score += 10
        
        # Add points for appropriate urgency
        if purpose_analysis.get("urgency") in ["medium", "high"]:
            score += 10
        
        # Add points for clear call to action
        if purpose_analysis.get("call_to_action") != "acknowledge":
            score += 5
        
        return min(100, score)
    
    def _suggest_content_length(self, purpose_analysis: Dict) -> str:
        """Suggest appropriate content length"""
        intent = purpose_analysis.get("intent", "general")
        
        if intent == "appreciation":
            return "Short (50-100 words)"
        elif intent == "request":
            return "Medium (150-250 words)"
        elif intent == "update":
            return "Medium-Long (200-350 words)"
        else:
            return "Medium (100-200 words)"
    
    def _identify_key_elements(self, purpose: str, context: Dict[str, Any]) -> List[str]:
        """Identify key elements that should be included"""
        elements = ["Clear subject line", "Appropriate greeting", "Main message"]
        
        if "meeting" in purpose.lower():
            elements.extend(["Time options", "Duration", "Agenda"])
        
        if "deadline" in str(context).lower():
            elements.append("Clear deadline")
        
        if context.get("urgent"):
            elements.append("Urgency indicator")
        
        elements.append("Call to action")
        elements.append("Professional closing")
        
        return elements
    
    def _suggest_tone_adjustment(self, purpose: str, current_tone: str) -> str:
        """Suggest tone adjustment based on purpose"""
        if any(word in purpose.lower() for word in ["urgent", "asap", "emergency"]):
            return "urgent"
        elif any(word in purpose.lower() for word in ["thank", "appreciate", "congratula"]):
            return "friendly"
        else:
            return current_tone