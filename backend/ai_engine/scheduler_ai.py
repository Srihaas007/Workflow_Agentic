"""
AI-powered task scheduling and optimization engine.

This module provides intelligent task scheduling, resource optimization,
and timeline management inspired by your time-based automation patterns.
"""

import asyncio
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4

class TaskStatus(Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class RecurrenceType(Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    CUSTOM = "custom"

class SchedulerAI:
    """AI engine for intelligent task scheduling and optimization"""
    
    def __init__(self):
        """Initialize the scheduler AI engine"""
        self.tasks = {}
        self.schedule = {}
        self.resource_pool = {}
        self.optimization_history = []
        self.constraints = self._load_default_constraints()
        
    def _load_default_constraints(self) -> Dict[str, Any]:
        """Load default scheduling constraints"""
        return {
            "working_hours": {
                "start": 9,  # 9 AM
                "end": 17,   # 5 PM
                "timezone": "UTC"
            },
            "working_days": [1, 2, 3, 4, 5],  # Monday to Friday
            "max_concurrent_tasks": 10,
            "break_duration": 15,  # minutes between tasks
            "max_daily_hours": 8,
            "resource_limits": {
                "cpu_intensive": 3,
                "memory_intensive": 2,
                "network_intensive": 5
            }
        }
    
    async def schedule_task(
        self,
        task_id: str,
        task_data: Dict[str, Any],
        constraints: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Schedule a single task using AI optimization.
        
        Inspired by your nested menu patterns, this creates intelligent
        decision trees for optimal scheduling.
        """
        try:
            # Validate and enrich task data
            enriched_task = await self._enrich_task_data(task_id, task_data)
            
            # Analyze task requirements
            requirements = self._analyze_task_requirements(enriched_task)
            
            # Find optimal time slot
            optimal_slot = await self._find_optimal_slot(enriched_task, requirements, constraints)
            
            # Update schedule
            self.tasks[task_id] = enriched_task
            self.schedule[task_id] = optimal_slot
            
            # Generate scheduling insights
            insights = self._generate_scheduling_insights(enriched_task, optimal_slot)
            
            result = {
                "task_id": task_id,
                "scheduled_time": optimal_slot["start_time"],
                "estimated_duration": optimal_slot["duration"],
                "priority_score": requirements["priority_score"],
                "resource_allocation": optimal_slot["resources"],
                "insights": insights,
                "confidence": optimal_slot["confidence"],
                "status": TaskStatus.SCHEDULED.value
            }
            
            # Log scheduling decision
            self._log_scheduling_decision(task_id, result)
            
            return result
            
        except Exception as e:
            logger.error(f"Task scheduling failed for {task_id}: {e}")
            return {
                "task_id": task_id,
                "error": str(e),
                "status": TaskStatus.FAILED.value
            }
    
    async def schedule_bulk_tasks(
        self,
        tasks: List[Dict[str, Any]],
        optimization_strategy: str = "balanced"
    ) -> Dict[str, Any]:
        """
        Schedule multiple tasks with global optimization.
        
        Similar to your location menu system, this handles complex
        nested decision making for multiple concurrent processes.
        """
        try:
            # Validate tasks
            validated_tasks = await self._validate_bulk_tasks(tasks)
            
            # Analyze task dependencies and conflicts
            dependency_graph = self._build_dependency_graph(validated_tasks)
            
            # Generate initial schedule
            initial_schedule = await self._generate_initial_schedule(validated_tasks, dependency_graph)
            
            # Optimize schedule using AI
            optimized_schedule = await self._optimize_schedule(initial_schedule, optimization_strategy)
            
            # Validate resource constraints
            resource_validated_schedule = self._validate_resource_constraints(optimized_schedule)
            
            # Calculate schedule metrics
            metrics = self._calculate_schedule_metrics(resource_validated_schedule)
            
            # Update internal state
            for task_id, task_info in resource_validated_schedule.items():
                self.tasks[task_id] = task_info["task_data"]
                self.schedule[task_id] = task_info["schedule_slot"]
            
            result = {
                "scheduled_tasks": len(resource_validated_schedule),
                "schedule": resource_validated_schedule,
                "optimization_strategy": optimization_strategy,
                "metrics": metrics,
                "generated_at": datetime.utcnow().isoformat(),
                "estimated_completion": self._calculate_completion_time(resource_validated_schedule),
                "resource_utilization": self._calculate_resource_utilization(resource_validated_schedule)
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Bulk task scheduling failed: {e}")
            return {"error": str(e), "scheduled_tasks": 0}
    
    async def _enrich_task_data(self, task_id: str, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich task data with AI-derived insights"""
        
        enriched = {
            "id": task_id,
            "name": task_data.get("name", f"Task {task_id}"),
            "description": task_data.get("description", ""),
            "priority": Priority(task_data.get("priority", Priority.MEDIUM.value)),
            "estimated_duration": task_data.get("estimated_duration", 60),  # minutes
            "deadline": task_data.get("deadline"),
            "recurrence": RecurrenceType(task_data.get("recurrence", RecurrenceType.NONE.value)),
            "dependencies": task_data.get("dependencies", []),
            "resource_requirements": task_data.get("resource_requirements", {}),
            "tags": task_data.get("tags", []),
            "created_at": datetime.utcnow().isoformat(),
            "status": TaskStatus.PENDING
        }
        
        # AI-powered enrichment
        enriched["complexity_score"] = self._calculate_complexity_score(enriched)
        enriched["urgency_score"] = self._calculate_urgency_score(enriched)
        enriched["estimated_effort"] = self._estimate_effort_required(enriched)
        enriched["optimal_time_of_day"] = self._suggest_optimal_time(enriched)
        enriched["conflict_potential"] = self._assess_conflict_potential(enriched)
        
        return enriched
    
    def _analyze_task_requirements(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze task requirements for optimal scheduling"""
        
        # Calculate priority score (inspired by your urgency detection)
        priority_score = self._calculate_priority_score(task)
        
        # Analyze resource needs
        resource_analysis = self._analyze_resource_needs(task)
        
        # Time window analysis
        time_window = self._calculate_optimal_time_window(task)
        
        # Dependency analysis
        dependency_impact = self._analyze_dependencies(task)
        
        return {
            "priority_score": priority_score,
            "resource_needs": resource_analysis,
            "time_window": time_window,
            "dependency_impact": dependency_impact,
            "scheduling_flexibility": self._assess_scheduling_flexibility(task),
            "risk_factors": self._identify_risk_factors(task)
        }
    
    async def _find_optimal_slot(
        self,
        task: Dict[str, Any],
        requirements: Dict[str, Any],
        constraints: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Find the optimal time slot for a task"""
        
        # Merge constraints
        effective_constraints = {**self.constraints}
        if constraints:
            effective_constraints.update(constraints)
        
        # Generate candidate slots
        candidates = self._generate_candidate_slots(task, requirements, effective_constraints)
        
        # Score each candidate
        scored_candidates = []
        for candidate in candidates:
            score = await self._score_time_slot(candidate, task, requirements)
            scored_candidates.append({**candidate, "score": score})
        
        # Select best slot
        if not scored_candidates:
            # Fallback to next available slot
            return self._get_fallback_slot(task, requirements)
        
        best_slot = max(scored_candidates, key=lambda x: x["score"])
        
        return {
            "start_time": best_slot["start_time"],
            "end_time": best_slot["end_time"],
            "duration": task["estimated_duration"],
            "resources": best_slot.get("resources", {}),
            "confidence": min(1.0, best_slot["score"] / 100),
            "alternatives": scored_candidates[:3],  # Top 3 alternatives
            "reasoning": best_slot.get("reasoning", "Optimal slot based on AI analysis")
        }
    
    def _generate_candidate_slots(
        self,
        task: Dict[str, Any],
        requirements: Dict[str, Any],
        constraints: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate candidate time slots"""
        
        candidates = []
        start_time = datetime.utcnow()
        
        # Look ahead for available slots
        for day_offset in range(30):  # Look 30 days ahead
            check_date = start_time + timedelta(days=day_offset)
            
            # Skip non-working days
            if check_date.weekday() not in constraints["working_days"]:
                continue
            
            # Generate hourly slots within working hours
            working_start = check_date.replace(
                hour=constraints["working_hours"]["start"],
                minute=0,
                second=0,
                microsecond=0
            )
            working_end = check_date.replace(
                hour=constraints["working_hours"]["end"],
                minute=0,
                second=0,
                microsecond=0
            )
            
            current_slot = working_start
            while current_slot + timedelta(minutes=task["estimated_duration"]) <= working_end:
                # Check if slot is available
                if self._is_slot_available(current_slot, task["estimated_duration"]):
                    candidates.append({
                        "start_time": current_slot.isoformat(),
                        "end_time": (current_slot + timedelta(minutes=task["estimated_duration"])).isoformat(),
                        "day_of_week": current_slot.weekday(),
                        "hour": current_slot.hour,
                        "resources": self._estimate_available_resources(current_slot)
                    })
                
                # Move to next hour
                current_slot += timedelta(hours=1)
                
                # Limit candidates to avoid too many options
                if len(candidates) >= 50:
                    return candidates
        
        return candidates
    
    async def _score_time_slot(
        self,
        slot: Dict[str, Any],
        task: Dict[str, Any],
        requirements: Dict[str, Any]
    ) -> float:
        """Score a time slot for a specific task"""
        
        score = 50.0  # Base score
        
        # Priority-based scoring
        priority_multiplier = {
            Priority.LOW: 0.8,
            Priority.MEDIUM: 1.0,
            Priority.HIGH: 1.3,
            Priority.URGENT: 1.5
        }
        score *= priority_multiplier.get(task["priority"], 1.0)
        
        # Time of day preference
        optimal_hour = task.get("optimal_time_of_day", 10)
        time_diff = abs(slot["hour"] - optimal_hour)
        score -= time_diff * 2  # Penalty for non-optimal time
        
        # Resource availability
        resource_score = self._score_resource_availability(slot, task["resource_requirements"])
        score += resource_score
        
        # Deadline urgency
        if task.get("deadline"):
            deadline = datetime.fromisoformat(task["deadline"])
            slot_time = datetime.fromisoformat(slot["start_time"])
            days_until_deadline = (deadline - slot_time).days
            
            if days_until_deadline < 0:
                score -= 50  # Past deadline
            elif days_until_deadline < 1:
                score += 30  # Same day as deadline
            elif days_until_deadline < 3:
                score += 20  # Within 3 days
            
        # Conflict avoidance
        conflict_penalty = self._calculate_conflict_penalty(slot, task)
        score -= conflict_penalty
        
        # Day of week preference
        if slot["day_of_week"] in [0, 1, 2]:  # Monday, Tuesday, Wednesday
            score += 5  # Slight preference for early week
        
        return max(0, score)
    
    def _build_dependency_graph(self, tasks: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """Build task dependency graph"""
        graph = {}
        
        for task in tasks:
            task_id = task.get("id", task.get("name"))
            dependencies = task.get("dependencies", [])
            graph[task_id] = dependencies
        
        # Validate no circular dependencies
        if self._has_circular_dependencies(graph):
            logger.warning("Circular dependencies detected in task list")
        
        return graph
    
    async def _optimize_schedule(
        self,
        schedule: Dict[str, Any],
        strategy: str
    ) -> Dict[str, Any]:
        """Optimize schedule using different strategies"""
        
        if strategy == "deadline_focused":
            return await self._optimize_for_deadlines(schedule)
        elif strategy == "resource_efficient":
            return await self._optimize_for_resources(schedule)
        elif strategy == "priority_based":
            return await self._optimize_for_priority(schedule)
        else:  # balanced
            return await self._optimize_balanced(schedule)
    
    async def _optimize_balanced(self, schedule: Dict[str, Any]) -> Dict[str, Any]:
        """Apply balanced optimization considering multiple factors"""
        
        optimized = dict(schedule)
        improvements = 0
        
        # Iterative improvement
        for iteration in range(5):  # Max 5 optimization passes
            current_score = self._evaluate_schedule_quality(optimized)
            
            # Try swapping adjacent tasks
            improved = self._try_task_swaps(optimized)
            
            # Try consolidating similar tasks
            improved = self._try_task_consolidation(improved) or improved
            
            # Try resource balancing
            improved = self._try_resource_balancing(improved) or improved
            
            new_score = self._evaluate_schedule_quality(improved)
            
            if new_score > current_score:
                optimized = improved
                improvements += 1
            else:
                break  # No more improvements
        
        logger.info(f"Schedule optimization completed with {improvements} improvements")
        return optimized
    
    def _calculate_schedule_metrics(self, schedule: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate comprehensive schedule metrics"""
        
        if not schedule:
            return {"error": "No schedule to analyze"}
        
        # Basic metrics
        total_tasks = len(schedule)
        total_duration = sum(
            task_info.get("schedule_slot", {}).get("duration", 0)
            for task_info in schedule.values()
        )
        
        # Priority distribution
        priority_dist = {}
        for task_info in schedule.values():
            task_data = task_info.get("task_data", {})
            priority = task_data.get("priority", Priority.MEDIUM)
            priority_name = priority.name if hasattr(priority, 'name') else str(priority)
            priority_dist[priority_name] = priority_dist.get(priority_name, 0) + 1
        
        # Time utilization
        schedule_span = self._calculate_schedule_span(schedule)
        utilization = (total_duration / schedule_span) * 100 if schedule_span > 0 else 0
        
        # Resource efficiency
        resource_efficiency = self._calculate_resource_efficiency(schedule)
        
        # Risk assessment
        risk_factors = self._assess_schedule_risks(schedule)
        
        return {
            "total_tasks": total_tasks,
            "total_duration_minutes": total_duration,
            "total_duration_hours": round(total_duration / 60, 2),
            "priority_distribution": priority_dist,
            "schedule_span_days": round(schedule_span / (24 * 60), 1),
            "time_utilization_percent": round(utilization, 1),
            "resource_efficiency": resource_efficiency,
            "risk_factors": risk_factors,
            "quality_score": self._evaluate_schedule_quality(schedule),
            "estimated_success_rate": f"{max(60, 100 - len(risk_factors) * 10)}%"
        }
    
    async def suggest_schedule_improvements(self, schedule_data: Dict[str, Any]) -> List[str]:
        """Suggest improvements for the current schedule"""
        suggestions = []
        
        if not schedule_data or "schedule" not in schedule_data:
            return ["No schedule data available for analysis"]
        
        schedule = schedule_data["schedule"]
        metrics = schedule_data.get("metrics", {})
        
        # Analyze utilization
        utilization = metrics.get("time_utilization_percent", 0)
        if utilization < 40:
            suggestions.append("Consider consolidating tasks to improve time utilization")
        elif utilization > 90:
            suggestions.append("Schedule appears overloaded - consider extending timeline or prioritizing tasks")
        
        # Analyze priority distribution
        priority_dist = metrics.get("priority_distribution", {})
        if priority_dist.get("URGENT", 0) > 3:
            suggestions.append("High number of urgent tasks - consider rescheduling non-critical items")
        
        # Resource efficiency
        resource_efficiency = metrics.get("resource_efficiency", {})
        if resource_efficiency.get("cpu_utilization", 0) > 80:
            suggestions.append("CPU-intensive tasks may need to be spread out more")
        
        # Risk factors
        risk_factors = metrics.get("risk_factors", [])
        if "tight_deadlines" in risk_factors:
            suggestions.append("Some deadlines are very tight - consider negotiating extensions")
        
        if "resource_conflicts" in risk_factors:
            suggestions.append("Resource conflicts detected - reallocate tasks to different time slots")
        
        # Quality score
        quality_score = metrics.get("quality_score", 0)
        if quality_score < 70:
            suggestions.append("Overall schedule quality could be improved - run optimization again")
        
        if not suggestions:
            suggestions.append("Schedule looks well-optimized! Consider regular reviews as priorities change")
        
        return suggestions
    
    # Helper methods for calculations and scoring
    def _calculate_complexity_score(self, task: Dict[str, Any]) -> int:
        """Calculate task complexity score"""
        score = 50  # Base complexity
        
        # Duration impact
        duration = task.get("estimated_duration", 60)
        if duration > 240:  # 4 hours
            score += 20
        elif duration > 120:  # 2 hours
            score += 10
        
        # Dependencies impact
        deps = len(task.get("dependencies", []))
        score += deps * 5
        
        # Resource requirements impact
        resources = task.get("resource_requirements", {})
        score += len(resources) * 3
        
        return min(100, score)
    
    def _calculate_urgency_score(self, task: Dict[str, Any]) -> int:
        """Calculate urgency score based on deadline and priority"""
        score = 0
        
        # Priority contribution
        priority_scores = {
            Priority.LOW: 10,
            Priority.MEDIUM: 30,
            Priority.HIGH: 60,
            Priority.URGENT: 90
        }
        score += priority_scores.get(task.get("priority"), 30)
        
        # Deadline contribution
        if task.get("deadline"):
            deadline = datetime.fromisoformat(task["deadline"])
            days_until = (deadline - datetime.utcnow()).days
            
            if days_until < 0:
                score += 50  # Overdue
            elif days_until == 0:
                score += 40  # Due today
            elif days_until <= 3:
                score += 30  # Due soon
            elif days_until <= 7:
                score += 20  # Due this week
        
        return min(100, score)
    
    def _is_slot_available(self, start_time: datetime, duration: int) -> bool:
        """Check if a time slot is available"""
        end_time = start_time + timedelta(minutes=duration)
        
        for scheduled_slot in self.schedule.values():
            scheduled_start = datetime.fromisoformat(scheduled_slot["start_time"])
            scheduled_end = datetime.fromisoformat(scheduled_slot["end_time"])
            
            # Check for overlap
            if (start_time < scheduled_end and end_time > scheduled_start):
                return False
        
        return True
    
    def _evaluate_schedule_quality(self, schedule: Dict[str, Any]) -> int:
        """Evaluate overall schedule quality score"""
        if not schedule:
            return 0
        
        score = 70  # Base score
        
        # Check for optimal time distribution
        time_scores = []
        for task_info in schedule.values():
            slot = task_info.get("schedule_slot", {})
            if slot.get("confidence"):
                time_scores.append(slot["confidence"] * 100)
        
        if time_scores:
            avg_confidence = sum(time_scores) / len(time_scores)
            score += (avg_confidence - 70) * 0.3
        
        # Penalty for conflicts
        conflicts = self._count_schedule_conflicts(schedule)
        score -= conflicts * 10
        
        # Bonus for good resource utilization
        resource_util = self._calculate_average_resource_utilization(schedule)
        if 60 <= resource_util <= 80:  # Optimal range
            score += 10
        
        return max(0, min(100, int(score)))
    
    def _has_circular_dependencies(self, graph: Dict[str, List[str]]) -> bool:
        """Check for circular dependencies using DFS"""
        visited = set()
        rec_stack = set()
        
        def dfs(node):
            if node in rec_stack:
                return True
            if node in visited:
                return False
            
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in graph.get(node, []):
                if dfs(neighbor):
                    return True
            
            rec_stack.remove(node)
            return False
        
        for node in graph:
            if dfs(node):
                return True
        return False
    
    def _calculate_schedule_span(self, schedule: Dict[str, Any]) -> int:
        """Calculate the total span of the schedule in minutes"""
        if not schedule:
            return 0
        
        start_times = []
        end_times = []
        
        for task_info in schedule.values():
            slot = task_info.get("schedule_slot", {})
            if slot.get("start_time") and slot.get("end_time"):
                start_times.append(datetime.fromisoformat(slot["start_time"]))
                end_times.append(datetime.fromisoformat(slot["end_time"]))
        
        if not start_times:
            return 0
        
        earliest = min(start_times)
        latest = max(end_times)
        
        return int((latest - earliest).total_seconds() / 60)
    
    def _count_schedule_conflicts(self, schedule: Dict[str, Any]) -> int:
        """Count the number of scheduling conflicts"""
        conflicts = 0
        tasks = list(schedule.items())
        
        for i, (task_id1, task_info1) in enumerate(tasks):
            slot1 = task_info1.get("schedule_slot", {})
            if not slot1.get("start_time") or not slot1.get("end_time"):
                continue
            
            start1 = datetime.fromisoformat(slot1["start_time"])
            end1 = datetime.fromisoformat(slot1["end_time"])
            
            for task_id2, task_info2 in tasks[i+1:]:
                slot2 = task_info2.get("schedule_slot", {})
                if not slot2.get("start_time") or not slot2.get("end_time"):
                    continue
                
                start2 = datetime.fromisoformat(slot2["start_time"])
                end2 = datetime.fromisoformat(slot2["end_time"])
                
                # Check for overlap
                if start1 < end2 and start2 < end1:
                    conflicts += 1
        
        return conflicts
    
    # Additional helper methods would continue here...
    # (Truncated for space, but would include methods for resource optimization,
    # deadline optimization, priority optimization, etc.)
    
    def _log_scheduling_decision(self, task_id: str, result: Dict[str, Any]):
        """Log scheduling decision for analysis"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "task_id": task_id,
            "scheduled_time": result.get("scheduled_time"),
            "confidence": result.get("confidence"),
            "reasoning": result.get("insights", {}).get("reasoning", "")
        }
        self.optimization_history.append(log_entry)
        
        # Keep only last 100 entries
        if len(self.optimization_history) > 100:
            self.optimization_history = self.optimization_history[-100:]