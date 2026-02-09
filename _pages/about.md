---
permalink: /
title: "About Me"
excerpt: "About Me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I am a third-year undergraduate student majoring in Robotics Engineering at Chongqing University (CQU), where I am a member of the Mingyue Science & Technology Innovation Experimental Class (Honor Class for Top Engineers).

My research interests lie at the intersection of Embodied AI, Robotics Control, and Swarm Intelligence. I am passionate about bridging the gap between high-level semantic planning and low-level dynamic control to build intelligent systems that can operate robustly in the real world.

Currently, I am actively working on Vision-Language Navigation (VLN). 、I have deeply reproduced and improved the NoMaD (Goal Masked Diffusion Policies) model, solving critical engineering challenges in sim-to-real transfer. I also have extensive experience in classical control theory, having developed ADRC (Active Disturbance Rejection Control) algorithms for UAV swarms.

I am actively looking for a Master's program (Fall 2027) in the United States related to Robotics, Control Systems, or Embodied AI.

### 🔥 News
* [Jan. 2026] Completed the deployment of the NoMaD diffusion policy model. I proposed a novel "Anisotropic Squash Transform" to solve the FOV blind-spot issue in visual navigation.
* [May 2025] My team won the Finalist (Top 8) award at the VEX U Robotics World Championship.
* [Jan. 2025] Awarded Meritorious Winner in the **U.S. Interdisciplinary Contest in Modeling (MCM/ICM)**.

### 📝 Selected Projects & Research

**1. Robust Vision-Language Navigation with Diffusion Policies**
* Role: Core Researcher | *Jan. 2026*
* Reproduced the SOTA NoMaD model and adapted it to NVIDIA Ampere architecture by solving CUDA version conflicts and refactoring the inference pipeline.
* **Innovation: Proposed a "Top-Crop + Squash"** image preprocessing pipeline to retain vertical field-of-view (FOV), eliminating near-field blind spots common in center-crop methods.
* Designed a dynamic inference pipeline to support real-time goal switching, validating the model's semantic understanding of navigation pairs.

1. UAV Swarm Control & Trajectory Planning
* **Role:** Team Leader | *Sep. 2024 - Present*
* Implemented a full control stack for UAVs: **A* algorithm for global path planning, Minimum Snap for trajectory smoothing, and ADRC** for robust underlying control.
* Achieved decentralized autonomous detection and formation reconfiguration for a 6-drone swarm, validating the system through Sim-to-Real experiments.

1. VEX U Robotics Competition (World Championship Finalist)
* **Role:** Control Group Lead | *Sep. 2024 - May 2025*
* Designed a cascaded PID control algorithm for the chassis drivetrain, improving navigational accuracy and reducing goal acquisition time by 15%.
* Led a team of 8 to optimize autonomous routines based on match analysis.

### 📚 Education
* Chongqing University (CQU), China
    * B.Eng. in Robotics Engineering (Sept. 2023 - June 2027)
    * **GPA:** 3.62 / 4.0 
    * *Mingyue Science & Technology Innovation Experimental Class (National Excellence Engineer Program)* 

### 💻 Technical Skills
* **Languages:** C/C++, Python, MATLAB, Verilog
* **Frameworks:** PyTorch, ROS2, OpenCV, Simulink
* **Hardware:** STM32, Arduino, FPGA, NVIDIA Jetson