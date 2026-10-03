"""
Rakshak SDK v1 - Python Package Setup
Zero-Trust Anti-AI Shield, In-Memory Canary Steganography,
and Adversarial AI Inversion Engine with Optional Native C++20 Core.
"""

from setuptools import setup, find_packages, Extension
import sys
import os

# Optional Native C++ Extension
extra_compile_args = []
if sys.platform == "win32":
    extra_compile_args = ["/std:c++20", "/O2", "/W4"]
else:
    extra_compile_args = ["-std=c++20", "-O3", "-fPIC"]

cpp_source = os.path.join("..", "cpp", "src", "rakshak_core.cpp")
cpp_include = os.path.join("..", "cpp", "include")

ext_modules = []
if os.path.exists(cpp_source):
    try:
        ext_modules.append(
            Extension(
                "rakshaksdk.rakshak_native_ext",
                sources=[cpp_source],
                include_dirs=[cpp_include],
                extra_compile_args=extra_compile_args,
                language="c++"
            )
        )
    except Exception:
        # Fallback to pure python
        pass

setup(
    name="rakshaksdkv1",
    version="1.0.0",
    description="Zero-Trust Anti-AI Shield & Adversarial AI Vector Scrambler (C++ & Python)",
    long_description="A military-grade zero-trust cyber defense SDK protecting APIs, databases, and websites from autonomous AI crawlers (GPT, Claude, Gemini) with C++20 low-latency core and Python adversarial AI destabilizers.",
    long_description_content_type="text/markdown",
    author="Rakshak Security Systems",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[],
    ext_modules=ext_modules,
    entry_points={
        "console_scripts": [
            "rakshak=rakshaksdk.cli:main",
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: C++",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Topic :: Security",
        "Topic :: Security :: Cryptography",
    ],
)
