---
title: "Kustomize for fun and profit"
date: 2021-06-23
author_profile: true
toc_label: "Kustomize for fun and profit"
excerpt: "Developing a container based infrastructure with kubernetes and kustomize."
header:
  # image: /assets/images/advantedge_1280x220.png
  teaser: /assets/images/aks_service_500x300.jpg
sidebar:
- title: "Role"
  image: assets/images/tux_logo.svg
  image_alt: "logo Dynamic Automation"
  text: "Cloud Consultant"
- title: "Responsibilities"
  text: "Design unified deployment model for containerized infrastructure"
category:
- articles
tags:
- operations
- cloud
- engineering
- architecture
- kubernetes
- kustomize
- containers

---

# Introduction
Managing a container based infrastructure on [kubernetes][1] can be a daunting task. Often, many resources are involved, each requiring specific adjustments for environments against they need to be deployed against. Managing the resources individually for many environments is error-prone and should therefore be avoided.

## Kustomize
[Kustomize][2] is a configuration management solution which allows developers to reuse existing resource and tailor them to specific environments. In contrast to other configuration management solutions which compose infrastructure by combining unique elements together, kustomize uses an additive approach by patching existing resources and overwriting or adding properties to existing resources.

In this article I will explain various methods and best practices for setting up configuration for kubernetes using [Kustomize][2].

# Alternatives

Kustomize vs Helm

# Directory Structure

# Resources

## Deployment

## Configmap

## Service

## Ingress

# Compose

# Pipeline

# References

1. [Kubernetes][1]
2. [Kustomize][2]

---
[1]: <https://kubernetes.io/>
[2]: <https://kustomize.io/>
