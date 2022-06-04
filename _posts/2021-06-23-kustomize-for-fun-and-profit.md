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

Kustomize vs Helm vs Crossplane vs Terraform vs ...

When considering configuration management systems for Kubernetes in particular, we can ofcourse also use Helm or something such as Crossplane or Pulumi. Why would you want to use one or the other and what are the advantages of Kustomize in particular?

## Kustomize vs Helm

### Helm

[Helm](https://helm.sh/) is a configuration management tool for Kubernetes which is mainly focused on the *distribution* of distributed applications running on top of Kubernetes.
Distributed applications are often composed of multiple microservices which each can have their own requirements with regards to availability, system- and network-resources.
Helm provides package management for applications where all required resources have been prefedined and only the input parameters for running the distributed application in your own cluster are required.

In theory it should be possible to deploy a helm package (*helm chart*) _as is_ with providing merely the required input parameters through a yaml file. However, in practice, helm charts are often highly opinionated, the package makes assumptions on the features of the cluster it will be running in. Such assumptions could be:

  - The version of Kubernetes which it is running on
  - Underlying platform capabilities (Azure, AWS, GCP)
  - Permissions available to the deployment agent (to be able to run as Daemonset or permissions to create ServiceAccounts)
  - Cluster resource access (Storage, CPU)

As Kubernetes can be deployed in many different contexts and is also used in secured environments these assumptions often require some adjustments. What happens is that these packages are downloaded by the DevOps/SRE squads and then adjusted to make the package run in their own context.

Personally I consider this an anti-pattern, the purpose of these packages is to be able to run the software the way that the developer intended it and by using the package we can leverage the work of the community on its deployment. When we adapt such packages manually we incur a technical debt as now we are ourselves responsible for managing and adapting the deployment process in the future (in case of software updates).

### Kustomize

Although *Kustomize* allows us to manage the configuration of deployments, it does not offer us a feature for package management and distribution.
Kustomize instead merely focusses on patching existing Kubernetes resource definitions (manifests) to be able to adapt them to different environments.
As this is such a common use case, Kustomize has been integrated into the *kubectl* command itself and can be triggered during any regular deployment of Kubernetes resources.





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
