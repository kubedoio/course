---
id: kubernetes-core-objects
course_id: kubernetes
title: Core Kubernetes Objects
duration_minutes: 25
vm_compatible: theory-only
source:
  - content/2020-01-01-k8s101-bolum1.markdown
  - content/2018-04-04-kubernetes-workshop.markdown
---

# Core Kubernetes Objects

Kubernetes is concept-only for this milestone. The browser VM can read manifests, but it should not be expected to run a control plane.

## Goals

- Explain Pods, Deployments, ReplicaSets, Services, ConfigMaps, and Secrets.
- Read a simple YAML manifest.
- Understand desired state and reconciliation.
- Connect Kubernetes concepts back to Docker containers.

## Manifest Reading

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
        - name: app
          image: nginx:alpine
          ports:
            - containerPort: 80
```

## Check

- Which field sets the number of desired Pods?
- Why must the selector match the Pod template labels?
- What stable network abstraction would expose these Pods?
